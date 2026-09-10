<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatiereResource;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\School;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MatiereController extends Controller
{
    /**
     * Get all matières
     */
    function index()
    {

        if (Auth::user()->school) {
            $matieres = Matiere::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $matieres = Matiere::orderByDesc("id")
                ->get();
        }

        $data = MatiereResource::collection($matieres);
        Log::debug("Donnees entrees", ["data" => $data]);
        return Inertia::render("Matiere/List", [
            "matieres" => $data,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('Matiere/Create', [
            "schools" => $schools,
            "classes" => Auth::user()->school ? Auth::user()->school->classes : Classe::all(),
            "professeurs" => Auth::user()->school ? Auth::user()->school->professeurs : []
        ]);
    }

    /**
     * Store des datas
     */
    function store(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "school_id" => "nullable|integer",
                "libelle" => "required",
            ], [
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
            ]);

            Matiere::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("matiere.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de la matière ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de la matière ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Edit
     */
    function edit(Matiere $matiere)
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('Matiere/Update', [
            "schools" => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Matiere $matiere)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "school_id" => "nullable|integer",
                "libelle" => "required",
            ], [
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
            ]);

            $matiere->update($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("matiere.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de la classe ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de la classe ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Destroy
     */
    function destroy(Matiere $matiere)
    {
        try {
            DB::beginTransaction();

            if (!$matiere) {
                throw new \Exception("Cette matiere n'existe pas");
            }
            $matiere->delete();

            DB::commit();
            return redirect()->route("matiere.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la matiere", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la matiere", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
