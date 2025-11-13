<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\ClasseResource;
use App\Http\Resources\InterrogationResource;
use App\Http\Resources\MatiereResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\TrimestreResource;
use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\Interrogation;
use App\Models\Matiere;
use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class InterrogationController extends Controller
{
    /**
     * Get all devoirs
     */
    function index()
    {
        if (Auth::user()->school) {
            $interrogations = Interrogation::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();

            // 
            $schools = School::with("trimestres")->latest()
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
            $interrogations = Interrogation::orderByDesc("id")->get();

            // 
            $schools = School::with("trimestres")->latest()->get();

            $apprenants = Apprenant::latest()->get();

            $trimestres = Trimestre::latest()->get();

            $matieres = Matiere::latest()->get();
            $classes = Classe::latest()->get();
        }

        // return SchoolResource::collection($schools);
        return Inertia::render("Interrogation/List", [
            "interrogations" => InterrogationResource::collection($interrogations),
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
    function create(Request $request)
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();

            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $trimestres = Trimestre::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $matieres = Matiere::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();

            $apprenants = Apprenant::latest()->get();

            $trimestres = Trimestre::latest()->get();

            $matieres = Matiere::latest()->get();
        }

        return Inertia::render('Interrogation/Create', [
            "schools" => SchoolResource::collection($schools),
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
                "school_id"     => "required|integer",
                "apprenant_id"  => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "note"          => "required|numeric",
            ], [
                "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "apprenant_id.required" => "L'identifiant de l'apprenant est obligatoire.",
                "apprenant_id.integer"  => "L'identifiant de l'apprenant doit être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "note.required"         => "La note est obligatoire.",
                "note.numeric"          => "La note doit être un nombre.",
            ]);

            Interrogation::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("interrogation.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de l'interrogation ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de l'interrogation ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Get form to Store multiples interrogations
     */
    function getStoreMultiple(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $request->validate([
                "school_id"     => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "classe_id"          => "required|integer",
            ], [
                "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

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

            return Inertia::render("Interrogation/StoreMultiple", [
                "school" => School::find($request->school_id),
                "trimestre" => Trimestre::find($request->trimestre_id),
                "matiere" => Matiere::find($request->matiere_id),
                "classe" => Classe::find($request->classe_id),
                "apprenants" => ApprenantResource::collection($apprenants),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de l'interrogation ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Store multiples interrogations
     */
    function postStoreMultiple(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "school_id"     => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "classe_id"          => "required|integer",
                "apprenants" => "array",
                "apprenants*apprenant_id" => "required|integer",
                "apprenants*note" => "required|numeric",
            ], [
                "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "classe_id.required" => "La classe doit être obligatoire.",
                "classe_id.integer"  => "La classe doit  être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",
            ]);

            // 
            foreach ($request->apprenants as $ligne) {
                Interrogation::create([
                    "apprenant_id" => $ligne["id"],
                    "school_id" => $validated["school_id"],
                    "trimestre_id" => $validated["trimestre_id"],
                    "matiere_id" => $validated["matiere_id"],
                    "classe_id" => $validated["classe_id"],
                    "note" => $ligne["note"]
                ]);
            }

            DB::commit();
            return redirect()->route("interrogation.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de l'interrogation ", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de l'interrogation ", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Request $request, Interrogation $interrogation)
    {
        try {
            if (!$interrogation) {
                throw new \Exception("Cette interrogation n'existe pas!");
            }

            $interrogation->load(["apprenant"]);

            if (Auth::user()->school) {
                $schools = School::latest()
                    ->where("id", Auth::user()->school_id)->get();

                $apprenants = Apprenant::latest()
                    ->where("school_id", Auth::user()->school_id)->get();

                $trimestres = Trimestre::latest()
                    ->where("school_id", Auth::user()->school_id)->get();

                $matieres = Matiere::latest()
                    ->where("school_id", Auth::user()->school_id)->get();
            } else {
                $schools = School::latest()->get();

                $apprenants = Apprenant::latest()->get();

                $trimestres = Trimestre::latest()->get();

                $matieres = Matiere::latest()->get();
            }

            return Inertia::render('Interrogation/Update', [
                "schools" => SchoolResource::collection($schools),
                "apprenants" => ApprenantResource::collection($apprenants),
                "trimestres" => TrimestreResource::collection($trimestres),
                "matieres" => MatiereResource::collection($matieres),
                "interrogation" => $interrogation
            ]);
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la modification de l'interrogation", ["error" => $e->getMessage()]);
            return redirect()->back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**Valider une interrogation */
    function validate(Request $request, Interrogation $interrogation)
    {
        try {
            DB::beginTransaction();

            if (!$interrogation) {
                throw new \Exception("Cette intérrogation n'existe pas!");
            }

            $interrogation->update(["is_validated" => true]);
            DB::commit();

            return redirect()->route("interrogation.index");
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la validation de l'interrogation", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**Valider une interrogation */
    function validateMultiple(Request $request)
    {
        try {
            Log::debug("Donnees entrees", ["data" => $request->all()]);

            DB::beginTransaction();

            $request->validate([
                "interroscheckeds" => "array",
            ]);

            // 
            foreach ($request->interroscheckeds as $ligne) {
                $interrogation = Interrogation::find($ligne["id"]);
                $interrogation->update(["is_validated" => true]);
            }

            DB::commit();

            return redirect()->route("interrogation.index");
        } catch (\Exception $e) {
            Log::debug("Erreure survenue lors de la validation de l'interrogation", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Update
     */
    function update(Request $request, Interrogation $interrogation)
    {
        try {

            if (!$interrogation) {
                throw new \Exception("Cette intérrogation n'existe pas!");
            }

            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "school_id"     => "required|integer",
                "apprenant_id"  => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "note"          => "required|numeric",
            ], [
                "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "apprenant_id.required" => "L'identifiant de l'apprenant est obligatoire.",
                "apprenant_id.integer"  => "L'identifiant de l'apprenant doit être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "note.required"         => "La note est obligatoire.",
                "note.numeric"          => "La note doit être un nombre.",
            ]);

            $interrogation->update($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("interrogation.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la modification de l'interrogation ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'interrogation ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Interrogation::all();

        return Inertia::render('Interrogation/Create', [
            'schools' => $schools,
        ]);
    }
}
