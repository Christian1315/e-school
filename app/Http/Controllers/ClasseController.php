<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Models\Classe;
use App\Models\School;
use App\Models\Serie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClasseController extends Controller
{
    /**
     * Get all classes
     */
    function index()
    {
        if (Auth::user()->school) {
            $classes = Classe::with(['school', 'serie', 'apprenants', 'lignes.professeur', 'lignes.matiere'])
                ->orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $classes = Classe::with(['school', 'serie', 'apprenants', 'lignes.professeur', 'lignes.matiere'])
                ->orderByDesc("id")
                ->get();
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

        $professeurs = Auth::user()->school ? Auth::user()->school->professeurs : [];
        $matieres = Auth::user()->school ? Auth::user()->school->matieres : [];
        $series = Auth::user()->school ? Auth::user()->school->series()->latest()->get() : Serie::latest()->get();

        return Inertia::render('Classe/Create', [
            "schools" => $schools,
            "professeurs" => $professeurs,
            "matieres" => $matieres,
            "series" => $series,
        ]);
    }

    /**
     * Store des datas
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "school_id" => "nullable|integer",
            "serie_id" => "required|integer|exists:series,id",
            "libelle" => "required",
            "scolarite" => "required|numeric",
            "lignes" => "required|array|min:1",
            "lignes.*.professeur_id" => "required|integer|exists:users,id",
            "lignes.*.matiere_id" => "required|integer|exists:matieres,id",
            "lignes.*.coefficient" => "required|numeric",
        ], [
            "school_id.integer" => "L'école est invalide",
            "serie_id.required" => "La série est requise",
            "serie_id.integer" => "La série est invalide",
            "serie_id.exists" => "La série n'existe pas",
            "libelle.required" => "Le libelle est réquis!",
            "scolarite.required" => "La scolarité est requise",
            "scolarite.numeric" => "Le format n'est pas valide",

            "lignes.required" => "Au moins une ligne est requise",
            "lignes.array" => "Le format des lignes est invalide",
            "lignes.min" => "Au moins une ligne est requise",

            "lignes.*.professeur_id.required" => "Le professeur est requis",
            "lignes.*.professeur_id.integer" => "Le professeur est invalide",
            "lignes.*.professeur_id.exists" => "Le professeur n'existe pas",

            "lignes.*.matiere_id.required" => "La matière est requise",
            "lignes.*.matiere_id.integer" => "La matière est invalide",
            "lignes.*.matiere_id.exists" => "La matière n'existe pas",

            "lignes.*.coefficient.required" => "Le coefficient est requis",
            "lignes.*.coefficient.numeric" => "Le format du coefficient est invalide",
        ]);

        $lignes = $validated['lignes'];
        unset($validated['lignes']);

        try {
            DB::beginTransaction();

            $classe = Classe::create($validated);

            $classe->lignes()->createMany($lignes);

            DB::commit();

            return redirect()->route("classe.index");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Erreur lors de la création de la classe", [
                "exception" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
            ]);
            return back()
                ->withInput()
                ->withErrors("Une erreur est survenue lors de la création de la classe.");
        }
    }

    /**
     * Edit
     */
    function edit(Classe $classe)
    {
        $classe->load(['serie', 'lignes.professeur', 'lignes.matiere']);

        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        $professeurs = Auth::user()->school ? Auth::user()->school->professeurs : [];
        $matieres = Auth::user()->school ? Auth::user()->school->matieres : [];
        $series = Auth::user()->school ? Auth::user()->school->series()->latest()->get() : Serie::latest()->get();

        return Inertia::render('Classe/Update', [
            "schools" => $schools,
            "classe" => $classe,
            "professeurs" => $professeurs,
            "matieres" => $matieres,
            "series" => $series,
        ]);
    }

    /**
     * Update
     */
    public function update(Request $request, Classe $classe)
    {
        $validated = $request->validate([
            "school_id" => "nullable|integer",
            "serie_id" => "required|integer|exists:series,id",
            "libelle" => "required",
            "scolarite" => "required|numeric",
            "lignes" => "required|array|min:1",
            "lignes.*.professeur_id" => "required|integer|exists:users,id",
            "lignes.*.matiere_id" => "required|integer|exists:matieres,id",
            "lignes.*.coefficient" => "required|numeric",
        ], [
            "school_id.integer" => "L'école est invalide",
            "serie_id.required" => "La série est requise",
            "serie_id.integer" => "La série est invalide",
            "serie_id.exists" => "La série n'existe pas",
            "libelle.required" => "Le libelle est réquis!",
            "scolarite.required" => "La scolarité est requise",
            "scolarite.numeric" => "Le format n'est pas valide",

            "lignes.required" => "Au moins une ligne est requise",
            "lignes.array" => "Le format des lignes est invalide",
            "lignes.min" => "Au moins une ligne est requise",

            "lignes.*.professeur_id.required" => "Le professeur est requis",
            "lignes.*.professeur_id.integer" => "Le professeur est invalide",
            "lignes.*.professeur_id.exists" => "Le professeur n'existe pas",

            "lignes.*.matiere_id.required" => "La matière est requise",
            "lignes.*.matiere_id.integer" => "La matière est invalide",
            "lignes.*.matiere_id.exists" => "La matière n'existe pas",

            "lignes.*.coefficient.required" => "Le coefficient est requis",
            "lignes.*.coefficient.numeric" => "Le format du coefficient est invalide",
        ]);

        $lignes = $validated['lignes'];
        unset($validated['lignes']);

        try {
            DB::beginTransaction();

            $classe->update($validated);

            // on remplace toutes les lignes existantes par les nouvelles
            $classe->lignes()->delete();
            $classe->lignes()->createMany($lignes);

            DB::commit();

            return redirect()->route("classe.index");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Erreur lors de la mise à jour de la classe", [
                "classe_id" => $classe->id,
                "exception" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
            ]);
            return back()
                ->withInput()
                ->withErrors("Une erreur est survenue lors de la mise à jour de la classe.");
        }
    }

    /**
     * Destroy
     */
    function destroy(Classe $classe)
    {
        Log::info("Début de suppression de la classe");
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
