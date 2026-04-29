<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatiereResource;
use App\Models\Matiere;
use App\Models\School;
use App\Models\User;
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
            $matieres = Matiere::orderByDesc("id")->get();
        }

        return Inertia::render("Matiere/List", [
            "matieres" => MatiereResource::collection($matieres),
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
            "professeurs" => Auth::user()->school ? Auth::user()->school->professeurs->load("school") : User::whereHas("roles", fn($query) => $query->where("name", "Professeur"))->with("school")->get(),
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
                'professeur_ids' => 'nullable|array|exists:users,id',
                "school_id" => "nullable|integer",
                "libelle" => "required",
                "coefficient" => "required|numeric",
            ], [
                // "school_id.required" => "L'école est réquise",
                "professeur_ids.array" => "Le format des professeurs est invalide",
                "professeur_ids.exists" => "Un ou plusieurs professeurs sélectionnés sont invalides",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",

                "coefficient.required" => "Le coefficient est réquis!",
                "coefficient.numeric" => "Le coefficient est invalide!",
            ]);

            $matiere = Matiere::create($validated);

            if ($request->professeur_ids) {
                $matiere->professeurs()->sync($validated["professeur_ids"]);
            }

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
            "professeurs" => Auth::user()->school ? Auth::user()->school?->professeurs->load("school") : User::whereHas("roles", fn($query) => $query->where("name", "Professeur"))->with("school")->get(),
            "matiere" => $matiere,
            "professeurs_ids" => $matiere->professeurs?->pluck("id")->toArray(),
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
                'professeur_ids' => 'nullable|array|exists:users,id',
                "school_id" => "nullable|integer",
                "libelle" => "required",
            ], [
                // "school_id.required" => "L'école est réquise",
                "professeur_ids.array" => "Le format des professeurs est invalide",
                "professeur_ids.exists" => "Un ou plusieurs professeurs sélectionnés sont invalides",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
            ]);

            $matiere->update($validated);

            if ($request->professeur_ids) {
                $matiere->professeurs()->sync($validated["professeur_ids"]);
            }

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
