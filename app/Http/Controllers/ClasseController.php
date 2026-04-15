<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Models\Classe;
use App\Models\School;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ClasseController extends Controller
{
    /**
     * Get all classes
     */
    function index()
    {
        if (Auth::user()->school) {
            $classes = Classe::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $classes = Classe::orderByDesc("id")->get();
        }

        return Inertia::render("Classe/List", [
            "classes" => ClasseResource::collection($classes),
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

        return Inertia::render('Classe/Create', [
            "schools" => $schools,
            "professeurs" => Auth::user()->school ? Auth::user()->school->professeurs : User::whereHas("roles", fn($query) => $query->where("name", "Professeur"))->get(),
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
                'professeur_ids' => 'array|exists:users,id',
                "school_id" => "nullable|integer",
                "libelle" => "required",
                "scolarite" => "required|numeric",
            ], [
                // "school_id.required" => "L'école est réquise",
                "professeur_ids.array" => "Le format des professeurs est invalide",
                "professeur_ids.exists" => "Un ou plusieurs professeurs sélectionnés sont invalides",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
                "scolarite.required" => "La scolarité est réquise",
                "scolarite.numeric" => "Le format n'est pas valide",
            ]);

            $classe = Classe::create($validated);

            $classe->professeurs()->sync($validated["professeur_ids"]);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("classe.index");
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
     * Edit
     */
    function edit(Classe $classe)
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('Classe/Update', [
            "schools" => $schools,
            "professeurs" => Auth::user()->school ? Auth::user()->school->professeurs : User::whereHas("roles", fn($query) => $query->where("name", "Professeur"))->get(),
            "classe" => $classe,
            "professeurs_ids" => $classe->professeurs->pluck("id")->toArray(),
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Classe $classe)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                'professeur_ids' => 'array|exists:users,id',
                "school_id" => "nullable|integer",
                "libelle" => "required",
                "scolarite" => "required|numeric",
            ], [
                // "school_id.required" => "L'école est réquise",
                "professeur_ids.array" => "Le format des professeurs est invalide",
                "professeur_ids.exists" => "Un ou plusieurs professeurs sélectionnés sont invalides",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
                "scolarite.required" => "La scolarité est réquise",
                "scolarite.numeric" => "Le format n'est pas valide",
            ]);

            $classe->update($validated);

            $classe->professeurs()->sync($validated["professeur_ids"]);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("classe.index");
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
    function destroy(Classe $classe)
    {
        try {
            DB::beginTransaction();

            if (!$classe) {
                throw new \Exception("Cette classe n'existe pas");
            }
            $classe->delete();

            DB::commit();
            return redirect()->route("classe.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la classe", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la classe", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
