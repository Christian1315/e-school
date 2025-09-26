<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\School;
use App\Models\Serie;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ApprenantController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        if (Auth::user()->school) {
            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::latest()->get();
        }

        return Inertia::render('Apprenant/List', [
            'apprenants' => ApprenantResource::collection($apprenants),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        $parentsQuery = User::query();

        if (Auth::user()->school_id) {
            $parentsQuery->where('school_id', Auth::user()->school_id);
        }

        $parents = $parentsQuery->whereHas('roles', function ($query) {
            $query->where('name', 'Parent');
        })->get();

        return Inertia::render('Apprenant/Create', [
            "parents" => $parents,

            "schools" => Auth::user()->school_id ?
                School::where("id", Auth::user()->school_id)->get() :
                School::all(),
            "classes" => Classe::all(),
            "series" => Serie::all(),
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
                "parent_id"      => "required|integer",
                "school_id"      => "required|integer",
                "classe_id"      => "required|integer",
                "serie_id"      => "required|integer",
                "firstname"      => "required|string",
                "lastname"       => "required|string",
                "adresse"        => "required|string",
                "email"          => "nullable|email",
                "phone"          => "nullable",
                "date_naissance" => "nullable|date",
                "lieu_naissance" => "nullable|string",
                "sexe"           => "required|in:Masculin,Féminin",
                "photo"          => "nullable|image|max:2048",
            ], [
                "parent_id.required"      => "Le parent est obligatoire.",
                "parent_id.integer"       => "Le parent doit être un identifiant valide.",

                "school_id.required"      => "L'école est obligatoire.",
                "school_id.integer"       => "L'école doit être un identifiant valide.",

                "classe_id.required"      => "La classe est obligatoire.",
                "classe_id.integer"       => "La classe doit être un identifiant valide.",

                "serie_id.required"      => "La serie est obligatoire.",
                "serie_id.integer"       => "La serie doit être un identifiant valide.",


                "firstname.required"      => "Le prénom de l'apprenant est obligatoire.",
                "lastname.required"       => "Le nom de l'apprenant est obligatoire.",

                "adresse.required"        => "L'adresse est obligatoire.",

                "email.required"          => "L'adresse email est obligatoire.",
                "email.email"             => "Veuillez fournir une adresse email valide.",

                "phone.required"          => "Le numéro de téléphone est obligatoire.",

                "date_naissance.required" => "La date de naissance est obligatoire.",
                "date_naissance.date"     => "Veuillez fournir une date de naissance valide.",

                "lieu_naissance.required" => "Le lieu de naissance est obligatoire.",

                "sexe.required"           => "Le sexe est obligatoire.",
                "sexe.in"                 => "Le sexe doit être soit Masculin (M) soit Féminin (F).",

                "photo.required"          => "La photo est obligatoire.",
                "photo.image"             => "Le fichier doit être une image (jpeg, png, jpg...).",
                "photo.max"               => "La photo ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            Apprenant::create($validated);

            DB::commit();
            return redirect()->route("apprenant.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }
}
