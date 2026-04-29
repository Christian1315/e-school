<?php

namespace App\Http\Controllers;

use App\Models\Apprenant;
use App\Models\Matiere;
use App\Models\Trimestre;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BulletinController extends Controller
{
    /**
     * Handle the incoming request.
     */
    function __invoke(Trimestre $trimestre)
    {
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
        $apprenants->transform(function ($apprenant) use ($trimestre, $user) {
            if ($user->school_id) {
                if ($user->hasRole("Professeur")) {
                    $matieres = $user->matieres; //les matières du prof
                } else {
                    $matieres = $apprenant->school?->matieres;
                }
            } else {
                $matieres = Matiere::latest()->get();
            }

            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre) {
                $matiere_interros = $apprenant->interrogations()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true, //les interrogations validées uniquement
                    ])
                    ->get();

                /** */
                return [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "interrogations" => [],
                    "moyenne_interro" => !$matiere_interros->isEmpty() ? number_format($matiere_interros->sum("note") / $matiere_interros->count(), 2) : 0
                ];
            });

            return $apprenant;
        });

        return Inertia::render('Bulletin/List', [
            'apprenants' => $apprenants,
            "trimestre" => $trimestre
        ]);
    }

    /**
     * Generate un bulletin
     */

    function generateBulletin(Trimestre $trimestre, Apprenant $apprenant, $annee_scolaire = null)
    {
        Log::info("Génération du bulletin pour l'apprenant: {$apprenant->nom} {$apprenant->prenom}, trimestre: {$trimestre->libelle} et année scolaire: {$annee_scolaire}");
        try {
            $apprenant->load(["school", "parent", "classe.apprenants", "serie"]);

            $logoPath = explode(env("APP_URL"), $apprenant->school->logo);

            $apprenantProfilPath = $apprenant->photo ? explode(env("APP_URL"), $apprenant->photo) : null;

            if (Auth::user()->school_id) {
                $_matieres = $apprenant->school?->matieres;
            } else {
                $_matieres = Matiere::latest()->get();
            }

            /**
             * Moyennes formatage
             */
            $matieres = $_matieres->map(function ($matiere) use ($apprenant, $trimestre, $annee_scolaire) {

                $matiere_interros = $apprenant->interrogations()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true,
                        "annee_scolaire" => $annee_scolaire, // année scolaire choisie
                    ])
                    ->get();

                $matiere_devoirs = $apprenant->devoirs()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true,
                        "annee_scolaire" => $annee_scolaire, // année scolaire choisie
                    ])
                    ->get();

                $moyenne_interro = !$matiere_interros->isEmpty()
                    ? $matiere_interros->sum("note") / $matiere_interros->count()
                    : 0;

                $sommeDevoirsNote = $matiere_devoirs->sum("note");
                $moyenne = ($moyenne_interro + $sommeDevoirsNote) / ($matiere_devoirs->count() + 1);
                $moyenneCoefficie = $moyenne * $matiere->coefficient;

                // 2️⃣ Calculer la moyenne faible & forte pour la matière
                $allMoyennes = $apprenant->school->apprenants->map(function ($eleve) use ($matiere, $trimestre, $annee_scolaire) {

                    $interros = $eleve->interrogations()
                        ->where([
                            "matiere_id" => $matiere->id,
                            "trimestre_id" => $trimestre->id,
                            "is_validated" => true,
                            "annee_scolaire" => $annee_scolaire, // année scolaire choisie
                        ])
                        ->get();

                    $devoirs = $eleve->devoirs()
                        ->where([
                            "matiere_id" => $matiere->id,
                            "trimestre_id" => $trimestre->id,
                            "is_validated" => true,
                            "annee_scolaire" => $annee_scolaire, // année scolaire choisie
                        ])
                        ->get();

                    $m_interro = $interros->isEmpty()
                        ? 0
                        : $interros->avg("note");

                    return ($m_interro + $devoirs->sum("note")) / 3;
                });

                // 3️⃣ Moyenne faible / forte
                $moyenne_faible = $allMoyennes->min();
                $moyenne_forte = $allMoyennes->max();

                // 4️⃣ Calcul du RANG
                $sorted = $allMoyennes->sortDesc()->values(); // tri du plus grand au plus petit
                $rang = $sorted->search($moyenne) + 1;         // position + 1

                return (object) [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "coefficient" => $matiere->coefficient,
                    "interrogations" => $matiere_interros,
                    "devoirs" => $matiere_devoirs,
                    "moyenne_interro" => round($moyenne_interro, 2),
                    "moyenne" => round($moyenne, 2),
                    "moyenne_coefficie" => round($moyenneCoefficie, 2),

                    "moyenne_faible" => $moyenne_faible,
                    "moyenne_forte" => $moyenne_forte,

                    "rang" => $rang,
                ];
            });

            // return $matieres;

            $apprenant->matieres = $matieres;
            $apprenant->rang = 3;
            $apprenant->statut = 'Passant';
            $apprenant->period = $annee_scolaire . " - " . ($annee_scolaire + 1);

            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.bulletins.bulletin", [
                "apprenant" => $apprenant,
                "trimestre" => $trimestre,
                "logo" => $logoPath[1] ?? null,
                "apprenantProfil" => $apprenantProfilPath ? $apprenantProfilPath[1] : null
            ]);

            // Set PDF orientation to landscape
            $pdf->setPaper('a4', 'landscape');

            return $pdf->stream();
        } catch (\Exception $e) {
            Log::debug("Eureure lors de la generation du bulletin", [
                "error" => $e->getMessage(),
                "line" => $e->getLine()
            ]);
            return "Eureure lors de la generation du bulletin : " . $e->getMessage();
        }
    }
}
