<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReglementResource;
use App\Models\Reglement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReglementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    function index()
    {
        $user = Auth::user();
        if ($user->school) {
            $reglements = Reglement::latest()
                ->where("school_id", $user->school_id)->get();
        } else {
            $reglements = Reglement::latest()->get();
        }

        return Inertia::render('Reglement/List', [
            'reglements' => ReglementResource::collection($reglements),
            'KKIAPAY_SECRET_KEY' => env("KKIAPAY_SECRET_KEY"),
            'callback' => route("reglement.validate")
        ]);
    }

    /**
     * Handle validation
     */
    function validate(Request $request, Reglement $reglement)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            DB::beginTransaction();

            if (!$request->get("transaction_id")) {
                throw new \Exception("Erreure de transaction");
            }
            // return $request->all();

            $reglement->update([
                "transactionId" => $request->transaction_id,
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("reglement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du reglement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du reglement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Create
     */
    function create()
    {
        return Inertia::render('Reglement/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);
        try {
            $validated = $request->validate([
                "school_id"      => "nullable|integer|exists:schools,id",
                "transactionId"      => "nullable|string",
                "montant"      => "required|numeric",
                "annee_scolaire" => "required|integer|min:2000|max:2030",
            ], [
                'school_id.integer' => "L'identifiant de l'école doit être un nombre entier.",
                'school_id.exists' => "L'école sélectionnée n'existe pas.",

                'transactionId.string' => "L'identifiant de transaction doit être un string.",

                'montant.required' => "Le montant est obligatoire.",
                'montant.numeric' => "Le montant doit être un nombre.",

                'annee_scolaire.required' => "L'année scolaire est obligatoire.",
                'annee_scolaire.integer' => "L'année scolaire doit être un nombre entier.",
                'annee_scolaire.min' => "L'année scolaire doit être supérieure ou égale à 2000.",
                'annee_scolaire.max' => "L'année scolaire doit être inférieure ou égale à 2030.",
            ]);

            DB::beginTransaction();

            Reglement::create($validated);

            DB::commit();
            return redirect()->route("reglement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du reglement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Reglement $reglement)
    {
        try {
            // traitement du reglement
        } catch (\Exception $e) {
            Log::debug("Erreure lors de création du reglement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reglement $reglement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reglement $reglement)
    {
        //
    }

    /**
     * Destroy
     */
    function destroy(Reglement $reglement)
    {
        try {
            DB::beginTransaction();

            if (!$reglement) {
                throw new \Exception("Ce reglement n'existe pas");
            }
            $reglement->delete();

            DB::commit();
            return redirect()->route("reglement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du reglement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du reglement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
