<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\ClasseResource;
use App\Http\Resources\DevoirResource;
use App\Http\Resources\MatiereResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\TrimestreResource;
use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\Devoir;
use App\Models\Matiere;
use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DevoirController extends Controller
{
    /**
     * Get all devoirs
     */
    function index()
    {
        if (Auth::user()->school) {
            $devoirs = Devoir::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();

            // 
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();

            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $trimestres = Trimestre::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $matieres = Matiere::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $classes = Classe::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $devoirs = Devoir::orderByDesc("id")->get();

            // 
            $schools = School::latest()->get();
            $apprenants = Apprenant::latest()->get();
            $trimestres = Trimestre::latest()->get();
            $matieres = Matiere::latest()->get();
            $classes = Classe::latest()->get();
        }

        return Inertia::render("Devoir/List", [
            "_devoirs" => DevoirResource::collection($devoirs),
            "schools" => SchoolResource::collection($schools),
            "apprenants" => ApprenantResource::collection($apprenants),
            "trimestres" => TrimestreResource::collection($trimestres),
            "matieres" => MatiereResource::collection($matieres),
            "classes" => ClasseResource::collection($classes),
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        if (Auth::user()->school) {
            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $trimestres = Trimestre::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $matieres = Matiere::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::latest()->get();

            $trimestres = Trimestre::latest()->get();

            $matieres = Matiere::latest()->get();
        }

        return Inertia::render('Devoir/Create', [
            "apprenants" => ApprenantResource::collection($apprenants),
            "trimestres" => TrimestreResource::collection($trimestres),
            "matieres" => MatiereResource::collection($matieres),
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
                "apprenant_id"  => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "note"          => "required|numeric",
                "annee_scolaire" => "required|numeric"
            ], [

                "apprenant_id.required" => "L'identifiant de l'apprenant est obligatoire.",
                "apprenant_id.integer"  => "L'identifiant de l'apprenant doit être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "note.required"         => "La note est obligatoire.",
                "note.numeric"          => "La note doit être un nombre.",
                "annee_scolaire.required"    => "L'année scolaire est réquise",
                "annee_scolaire.numeric"    => "Le format est invalide!",
            ]);

            Devoir::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("devoir.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création du devoir ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création du devoir ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Get form to Store multiples devoirs
     */
    function getStoreMultiple(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $request->validate([
                // "school_id"     => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "classe_id"          => "required|integer",
            ], [
                // "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                // "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "classe_id.required" => "La classe doit être obligatoire.",
                "classe_id.integer"  => "La classe doit  être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",
            ]);

            $Query = Apprenant::where("classe_id", $request->classe_id)
                ->latest();
            if (Auth::user()->school) {
                $apprenants = $Query
                    ->where("school_id", Auth::user()->school_id)->get();
            } else {
                $apprenants = $Query->get();
            }

            return Inertia::render("Devoir/StoreMultiple", [
                // "school" => School::find($request->school_id),
                "trimestre" => Trimestre::find($request->trimestre_id),
                "matiere" => Matiere::find($request->matiere_id),
                "classe" => Classe::find($request->classe_id),
                "apprenants" => ApprenantResource::collection($apprenants),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création du devoir ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Store multiples devoirs
     */
    function postStoreMultiple(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                // "school_id"     => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "classe_id"          => "required|integer",
                "apprenants" => "array",
                "apprenants*apprenant_id" => "required|integer",
                "apprenants*note" => "required|numeric",
                "annee_scolaire" => "required|numeric"
            ], [
                // "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                // "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "classe_id.required" => "La classe doit être obligatoire.",
                "classe_id.integer"  => "La classe doit  être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "annee_scolaire.required"    => "L'année scolaire est réquise",
                "annee_scolaire.numeric"    => "Le format est invalide!",
            ]);

            // 
            foreach ($request->apprenants as $ligne) {
                Devoir::create([
                    "apprenant_id" => $ligne["id"],
                    // "school_id" => $validated["school_id"],
                    "trimestre_id" => $validated["trimestre_id"],
                    "matiere_id" => $validated["matiere_id"],
                    "classe_id" => $validated["classe_id"],
                    "note" => $ligne["note"],
                    "annee_scolaire" => $validated["annee_scolaire"],
                ]);
            }

            DB::commit();
            return redirect()->route("devoir.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création du devoir ", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création du devoir ", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Devoir $devoir)
    {
        try {

            $devoir->load(["apprenant"]);

            if (Auth::user()->school) {

                $apprenants = Apprenant::latest()
                    ->where("school_id", Auth::user()->school_id)->get();

                $trimestres = Trimestre::latest()
                    ->where("school_id", Auth::user()->school_id)->get();

                $matieres = Matiere::latest()
                    ->where("school_id", Auth::user()->school_id)->get();
            } else {

                $apprenants = Apprenant::latest()->get();

                $trimestres = Trimestre::latest()->get();

                $matieres = Matiere::latest()->get();
            }

            return Inertia::render('Devoir/Update', [
                "apprenants" => ApprenantResource::collection($apprenants),
                "trimestres" => TrimestreResource::collection($trimestres),
                "matieres" => MatiereResource::collection($matieres),
                "devoir" => $devoir
            ]);
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la modification du devoir", ["error" => $e->getMessage()]);
            return redirect()->back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**Valider un devoir */
    function validate(Devoir $devoir)
    {
        try {
            DB::beginTransaction();

            $devoir->update(["is_validated" => true]);
            DB::commit();

            return redirect()->route("devoir.index");
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la validation du devoir", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**Valider un devoir */
    function validateMultiple(Request $request)
    {
        try {
            Log::debug("Donnees entrees", ["data" => $request->all()]);

            DB::beginTransaction();

            $request->validate([
                "devoirscheckeds" => "array",
            ]);

            // 
            foreach ($request->devoirscheckeds as $ligne) {
                $devoir = Devoir::find($ligne["id"]);
                $devoir->update(["is_validated" => true]);
            }

            DB::commit();

            return redirect()->route("devoir.index");
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la validation du devoir", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Update
     */
    function update(Request $request, Devoir $devoir)
    {
        try {

            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "apprenant_id"  => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "note"          => "required|numeric",
                "annee_scolaire" => "required|numeric"
            ], [

                "apprenant_id.required" => "L'identifiant de l'apprenant est obligatoire.",
                "apprenant_id.integer"  => "L'identifiant de l'apprenant doit être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "note.required"         => "La note est obligatoire.",
                "note.numeric"          => "La note doit être un nombre.",
                "annee_scolaire.required"    => "L'année scolaire est réquise",
                "annee_scolaire.numeric"    => "Le format est invalide!",
            ]);

            $devoir->update($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("devoir.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la modification du devoir ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du devoir ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Destroy
     */
    function destroy(Devoir $devoir)
    {
        try {
            DB::beginTransaction();

            $devoir->delete();

            DB::commit();
            return redirect()->route("devoir.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du devoir", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du devoir", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
