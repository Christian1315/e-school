<?php

namespace App\Http\Controllers;

use App\Http\Resources\PayementResource;
use App\Models\Apprenant;
use App\Models\Payement;
use App\Models\School;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PayementController extends Controller
{
    /**
     * Index
     */
    function index()
    {
        if (Auth::user()->school) {
            $payements = Payement::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $payements = Payement::latest()->get();
        }

        return Inertia::render('Payement/List', [
            'payements' => PayementResource::collection($payements),
        ]);
    }

    /**
     * Generate receit
     */

    function generateReceit(Payement $paiement)
    {
        try {
            DB::beginTransaction();
            $paiement->load(["school", "apprenant.parent.detail", "apprenant.classe"]);

            $logoPath = explode(env("APP_URL"), $paiement->school->logo);

            /**
             * Reste à payer
             */
            $reste = ($paiement->apprenant?->classe?->scolarite ?? 0) - $paiement->montant;

            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.paiements.receit", [
                "paiement" => $paiement,
                "reste" => $reste,
                "logo" => $logoPath[1]
            ]);

            // marquer l'inscription comme reçu generé
            $paiement->update(["receipted" => true]);

            // Set PDF orientation to landscape
            $pdf->setPaper('a4', 'landscape');

            DB::commit();
            return $pdf->stream();
        } catch (\Exception $e) {
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Create
     */
    function create()
    {
        return Inertia::render('Payement/Create', [
            "apprenants" => Auth::user()->school_id ?
                Apprenant::with("school")->where("school_id", Auth::user()->school_id)->get() :
                Apprenant::with("school")->get(),
            "schools" => Auth::user()->school_id ?
                School::where("id", Auth::user()->school_id)->get() :
                School::all(),
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
                "school_id"      => "nullable|integer|exists:schools,id",
                "apprenant_id"      => "required|integer",
                "montant"      => "required|numeric",
                "paiement_receit"          => "nullable|file",
                "date_paiement" => "required|date",
                "annee_scolaire" => "required|integer|min:2000|max:2030",
            ], [
                "apprenant_id.required"      => "L'apprenant est obligatoire.",
                "apprenant_id.integer"       => "L'apprenant doit être un identifiant valide.",

                "montant.required" => "Le montant est obligatoires.",
                "montant.numeric"  => "Le montant doit être un nombre valide.",

                "paiement_receit.file"             => "Le fichier est invalide",
                "paiement_receit.max"               => "La photo ne doit pas dépasser 2 Mo.",
                "annee_scolaire.required" => "L'année scolaire est obligatoire.",
                "annee_scolaire.integer" => "L'année scolaire doit être un nombre valide.",
                "annee_scolaire.min" => "L'année scolaire doit être comprise entre 2000 et 2030.",
                "annee_scolaire.max" => "L'année scolaire doit être comprise entre 2000 et 2030.",
            ]);

            DB::beginTransaction();

            Payement::create($validated);

            DB::commit();
            return redirect()->route("paiement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du paiment", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Payement $paiement)
    {
        try {

            $paiement->load(["school", "apprenant"]);

            return Inertia::render('Payement/Update', [
                "apprenants" => Auth::user()->school_id ?
                    Apprenant::with('school')->where("school_id", Auth::user()->school_id)->get() :
                    Apprenant::with('school')->get(),
                "schools" => Auth::user()->school_id ?
                    School::where("id", Auth::user()->school_id)->get() :
                    School::all(),
                "paiement" => $paiement
            ]);
        } catch (\Exception $e) {
            Log::debug("Erreure de modification", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Update
     */
    function update(Request $request, Payement $paiement)
    {
        Log::info("Les datas", ["data" => $request->all()]);
        try {
            if (!$paiement) {
                throw new \Exception("Ce paiement n'existe pas!");
            }

            $validated = $request->validate([
                "school_id"      => "nullable|integer|exists:schools,id",
                "apprenant_id"      => "required|integer",
                "date_paiement" => "required|date",
                "montant"      => "required|numeric",
                "paiement_receit"          => "nullable|file",
            ], [
                "apprenant_id.required"      => "L'apprenant est obligatoire.",
                "apprenant_id.integer"       => "L'apprenant doit être un identifiant valide.",

                "school_id.required"      => "L'école est obligatoire.",
                "school_id.integer"       => "L'école doit être un identifiant valide.",

                "montant.required" => "Le montant est obligatoires.",
                "montant.numeric"  => "Le montant doit être un nombre valide.",

                "paiement_receit.file"             => "Le fichier est invalide",
                "paiement_receit.max"               => "La photo ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            $validated["dossier_transfert"] = $paiement->handlePaiementReceit() ?? $paiement->paiement_receit;
            $paiement->update($validated);

            DB::commit();
            return redirect()->route("paiement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la mis à jour du paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la mis à jour du paiment", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Payement $paiement)
    {
        try {
            DB::beginTransaction();

            if (!$paiement) {
                throw new \Exception("Ce paiement n'existe pas");
            }
            $paiement->delete();

            DB::commit();
            return redirect()->route("paiement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du paiement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
