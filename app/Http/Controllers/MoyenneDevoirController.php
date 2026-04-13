<?php

namespace App\Http\Controllers;

use App\Http\Resources\DevoirResource;
use App\Models\Apprenant;
use App\Models\Matiere;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MoyenneDevoirController extends Controller
{
    function __invoke(Trimestre $trimestre, $annee_scolaire = null)
    {
        Log::info("Calcul des moyennes des devoirs pour le trimestre: {$trimestre->libelle} et l'année scolaire: {$annee_scolaire}");

        if (Auth::user()->school) {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()->get();
        }

        /**
         * Moyennes formatage
         */
        $apprenants->transform(function ($apprenant) use ($trimestre, $annee_scolaire) {
            if (Auth::user()->school_id) {
                $matieres = $apprenant->school?->matieres;
            } else {
                $matieres = Matiere::latest()->get();
            }

            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre, &$annee_scolaire) {
                $matiere_devoirs = $apprenant->devoirs()
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
                    "devoirs" => DevoirResource::collection($matiere_devoirs),
                    "moyenne_devoir" => !$matiere_devoirs->isEmpty() ? number_format($matiere_devoirs->sum("note") / $matiere_devoirs->count(), 2) : 0
                ];
            });

            return $apprenant;
        });

        // return response()->json($apprenants);
        return Inertia::render('MoyennesDevoir/List', [
            'apprenants' => $apprenants,
            "trimestre" => $trimestre,
            "annee_scolaire" => $annee_scolaire
        ]);
    }
}
