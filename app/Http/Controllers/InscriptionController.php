<?php

namespace App\Http\Controllers;

use App\Http\Resources\InscriptionResource;
use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\School;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InscriptionController extends Controller
{
    /**
     * Index
     */
    function index()
    {
        if (Auth::user()->school) {
            $inscriptions = Inscription::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $inscriptions = Inscription::latest()->get();
        }

        return Inertia::render('Inscription/List', [
            'inscriptions' => InscriptionResource::collection($inscriptions),
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        if (Auth::user()->school_id) {
            $apprenantQuery = Apprenant::where("school_id", Auth::user()->school_id);
            $schoolQuery = School::where("id", Auth::user()->school_id);
        } else {
            $apprenantQuery = Apprenant::query();
            $schoolQuery = School::query();
        }
        return Inertia::render('Inscription/Create', [
            "apprenants" => $apprenantQuery->with("school")->get(),
            "schools" => $schoolQuery->get(),
        ]);
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);
        try {
            $validated = $request->validate([
                // "school_id"          => "required|integer",
                "apprenant_id"       => "required|integer",
                "numero_educ_master" => "required|string",
                "frais_inscription"  => "required|numeric",
                "annee_scolaire" => "required",
                "dossier_transfert"  => "nullable|file|mimes:pdf,doc,docx|max:2048",
            ], [
                // "school_id.required"      => "L'école est obligatoire.",
                // "school_id.integer"       => "L'école doit être un identifiant valide.",

                "apprenant_id.required"   => "L'apprenant est obligatoire.",
                "apprenant_id.integer"    => "L'apprenant doit être un identifiant valide.",

                "numero_educ_master.required" => "Le numéro éduc master est obligatoire.",

                "frais_inscription.required" => "Les frais d’inscription sont obligatoires.",
                "frais_inscription.numeric"  => "Les frais doivent être un nombre valide.",

                "dossier_transfert.file"     => "Le dossier de transfert doit être un fichier.",
                "dossier_transfert.mimes"    => "Le dossier doit être un fichier PDF ou Word (pdf, doc, docx).",
                "dossier_transfert.max"      => "Le dossier de transfert ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            Inscription::create($validated);

            DB::commit();
            return redirect()->route("inscription.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'inscription", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'inscription", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Inscription $inscription)
    {
        try {

            if (Auth::user()->school_id) {
                $apprenantQuery = Apprenant::where("school_id", Auth::user()->school_id);
                $schoolQuery = School::where("id", Auth::user()->school_id);
            } else {
                $apprenantQuery = Apprenant::query();
                $schoolQuery = School::query();
            }

            $inscription->load(["school", "apprenant"]);

            return Inertia::render('Inscription/Update', [
                'inscription' => $inscription,
                "apprenants" => $apprenantQuery->with("school")->get(),
                "schools" => $schoolQuery->get(),
            ]);
        } catch (\Exception $e) {
            Log::debug("Erreure de modification", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Update
     */
    function update(Request $request, Inscription $inscription)
    {
        Log::info("Les datas", ["data" => $request->all()]);
        try {
            if (!$inscription) {
                throw new \Exception("Cette inscription n'existe pas!");
            }

            $validated = $request->validate([
                // "school_id"          => "required|integer",
                "apprenant_id"       => "required|integer",
                "numero_educ_master" => "required|string",
                "frais_inscription"  => "required|numeric",
                "annee_scolaire" => "required",
                "dossier_transfert"  => "nullable|file|mimes:pdf,doc,docx|max:2048",
            ], [
                // "school_id.required"      => "L'école est obligatoire.",
                // "school_id.integer"       => "L'école doit être un identifiant valide.",

                "apprenant_id.required"   => "L'apprenant est obligatoire.",
                "apprenant_id.integer"    => "L'apprenant doit être un identifiant valide.",

                "numero_educ_master.required" => "Le numéro éduc master est obligatoire.",

                "frais_inscription.required" => "Les frais d’inscription sont obligatoires.",
                "frais_inscription.numeric"  => "Les frais doivent être un nombre valide.",

                "dossier_transfert.file"     => "Le dossier de transfert doit être un fichier.",
                "dossier_transfert.mimes"    => "Le dossier doit être un fichier PDF ou Word (pdf, doc, docx).",
                "dossier_transfert.max"      => "Le dossier de transfert ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            $inscription->update($validated);

            DB::commit();
            return redirect()->route("inscription.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'inscription", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'inscription", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Generate receit
     */

    function generateReceit(Inscription $inscription, $reste)
    {
        try {
            DB::beginTransaction();

            $inscription->load(["school", "apprenant.parent.detail", "apprenant.classe"]);
            $logoPath = explode(env("APP_URL"), $inscription->school->logo);

            // return $logoPath;
            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.souscriptions.receit", [
                "inscription" => $inscription,
                "reste" => $reste,
                "logo" => $logoPath[1]
            ]);

            // Set PDF orientation to landscape
            $pdf->setPaper('a4', 'landscape');

            // marquer l'inscription comme reçu generé
            $inscription->update(["receipted" => true]);

            DB::commit();
            return $pdf->stream();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'inscription", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Inscription $inscription)
    {
        try {
            DB::beginTransaction();

            if (!$inscription) {
                throw new \Exception("Cette inscription n'existe pas");
            }
            $inscription->delete();

            DB::commit();
            return redirect()->route("inscription.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de l'inscription", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de l'inscription", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
