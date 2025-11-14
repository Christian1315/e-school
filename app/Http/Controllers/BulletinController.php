<?php

namespace App\Http\Controllers;

use App\Http\Resources\DevoirResource;
use App\Http\Resources\InterrogationResource;
use App\Models\Apprenant;
use App\Models\Trimestre;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BulletinController extends Controller
{
    /**
     * Handle the incoming request.
     */
    function __invoke(Request $request, Trimestre $trimestre)
    {
        if (Auth::user()->school) {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()->get();
        }

        /**
         * Moyennes formatage
         */
        $apprenants->transform(function ($apprenant) use ($trimestre) {
            $matieres = $apprenant->school->matieres;

            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre) {
                $matiere_interros = $apprenant->interrogations()
                    ->where(["matiere_id" => $matiere->id, "trimestre_id" => $trimestre->id])->get();

                /** */
                return [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "interrogations" => [],
                    "moyenne_interro" => !$matiere_interros->isEmpty() ? $matiere_interros->sum("note") / $matiere_interros->count() : 0
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

    function generateBulletin(Request $request, Trimestre $trimestre, Apprenant $apprenant)
    {
        try {
            $apprenant->load(["school", "parent", "classe.apprenants", "serie"]);

            $logoPath = explode(env("APP_URL"), $apprenant->school->logo);
            $apprenantProfilPath = explode(env("APP_URL"), $apprenant->photo);

            /**
             * Moyennes formatage
             */
            $matieres = $apprenant->school->matieres->map(function ($matiere) use ($apprenant, $trimestre) {

                $matiere_interros = $apprenant->interrogations()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true
                    ])
                    ->get();

                $matiere_devoirs = $apprenant->devoirs()
                    ->where([
                        "matiere_id" => $matiere->id,
                        "trimestre_id" => $trimestre->id,
                        "is_validated" => true
                    ])
                    ->get();

                $moyenne_interro = !$matiere_interros->isEmpty()
                    ? $matiere_interros->sum("note") / $matiere_interros->count()
                    : 0;

                $sommeDevoirsNote = $matiere_devoirs->sum("note");
                $moyenne = ($moyenne_interro + $sommeDevoirsNote) / 3;
                $moyenneCoefficie = $moyenne * $matiere->coefficient;

                // 2️⃣ Calculer la moyenne faible & forte pour la matière
                $allMoyennes = $apprenant->school->apprenants->map(function ($eleve) use ($matiere, $trimestre) {

                    $interros = $eleve->interrogations()
                        ->where([
                            "matiere_id" => $matiere->id,
                            "trimestre_id" => $trimestre->id,
                            "is_validated" => true
                        ])
                        ->get();

                    $devoirs = $eleve->devoirs()
                        ->where([
                            "matiere_id" => $matiere->id,
                            "trimestre_id" => $trimestre->id,
                            "is_validated" => true
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
                    "moyenne_interro" => $moyenne_interro,
                    "moyenne" => $moyenne,
                    "moyenne_coefficie" => $moyenneCoefficie,

                    "moyenne_faible" => $moyenne_faible,
                    "moyenne_forte" => $moyenne_forte,

                    "rang" => $rang,
                ];
            });

            // return $matieres;

            $apprenant->matieres = $matieres;
            $apprenant->rang = 3;
            $apprenant->statut = 'Passant';
            $apprenant->period = '2023-2024';

            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.bulletins.bulletin", [
                "apprenant" => $apprenant,
                "trimestre" => $trimestre,
                "logo" => $logoPath[1] ?? null,
                "apprenantProfil" => $apprenantProfilPath[1] ?? null
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
            // return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
