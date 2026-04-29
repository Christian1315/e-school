<?php

namespace App\Http\Controllers;

use App\Http\Resources\InterrogationResource;
use App\Models\Apprenant;
use App\Models\Matiere;
use App\Models\Trimestre;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MoyenneInterrogationController extends Controller
{
    function __invoke(Trimestre $trimestre, $annee_scolaire = null)
    {
        Log::info("Calcul des moyennes d'interrogation pour le trimestre: {$trimestre->libelle} et l'année scolaire: {$annee_scolaire}");

        $user = Auth::user();
        if ($user->school) {
            if ($user->hasRole("Professeur")) {
                $apprenants = $user->apprenants;
            } else {
                $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()
                    ->where("school_id", Auth::user()->school_id)->get();
            }
        } else {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()->get();
        }

        /**
         * Moyennes formatage
         */
        $apprenants->transform(function ($apprenant) use ($trimestre, $annee_scolaire, $user) {

            if ($user->school_id) {
                if ($user->hasRole("Professeur")) {
                    $matieres = $user->matieres; //les matières du prof
                } else {
                    $matieres = $apprenant->school?->matieres;
                }
            } else {
                $matieres = Matiere::latest()->get();
            }

            // pour chaque matiere, on recupere les interros de l'apprenant pour le trimestre en cours
            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre, &$annee_scolaire) {
                $matiere_interros = $apprenant->interrogations()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true, //les interrogations validées uniquement
                        "annee_scolaire" => $annee_scolaire, // année scolaire choisie
                    ])
                    ->get();

                /** */
                return [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "interrogations" => InterrogationResource::collection($matiere_interros),
                    "moyenne_interro" => !$matiere_interros->isEmpty() ? number_format($matiere_interros->sum("note") / $matiere_interros->count(), 2) : 0
                ];
            });

            return $apprenant;
        });

        return Inertia::render('MoyennesInterro/List', [
            'apprenants' => $apprenants,
            "trimestre" => $trimestre,
            "annee_scolaire" => $annee_scolaire
        ]);
    }
}
