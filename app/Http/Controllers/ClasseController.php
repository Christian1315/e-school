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
    function create(Request $request)
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('Classe/Create', [
            "schools" => $schools,
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
                "school_id" => "required|integer",
                "libelle" => "required",
                "scolarite" => "required|numeric",
            ], [
                "school_id.required" => "L'école est réquise",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
                "scolarite.required" => "La scolarité est réquise",
                "scolarite.numeric" => "Le format n'est pas valide",
            ]);

            Classe::create($validated);

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
    function edit(Request $request, Classe $classe)
    {
        $school = Auth::user()->school;
        if ($school) {
            $queryProffesseurs = User::whereHas("roles", fn($query) => $query->where("name", "Professeur" . ' (' . $school->raison_sociale . ')'));
            $queryProffesseurs->where("school_id",  $school->id);
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schoolsName = School::get()->pluck("raison_sociale");
            $nameArray = $schoolsName->map(function ($name) {
                return "Professeur" . ' (' . $name . ')';
            })->concat(["Professeur"])->toArray();

            $queryProffesseurs = User::whereHas("roles", fn($query) => $query->whereIn("name", $nameArray));
            $schools = School::latest()->get();
        }

        return Inertia::render('Classe/Update', [
            'professeurs' => $queryProffesseurs->get(),
            "classe" => $classe->load("professeurs"),
            "schools" => $schools,
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
                "school_id" => "required|integer",
                "libelle" => "required",
                "scolarite" => "required|numeric",
                'professeur_id' => 'required|array',
                'professeur_id.*' => 'exists:users,id'
            ], [
                "school_id.required" => "L'école est réquise",
                "school_id.integer" => "L'école est invalide",
                "professeur_id.required" => "Le professeur est réquis",
                "professeur_id.integer" => "Le champ est invalide",
                "libelle.required" => "Le libelle est réquis!",
                "scolarite.required" => "La scolarité est réquise",
                "scolarite.numeric" => "Le format n'est pas valide",
            ]);

            $classe->update($validated);

            $classe->professeurs()->sync($validated["professeur_id"]);

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
    function destroy(Request $request, Classe $classe)
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
