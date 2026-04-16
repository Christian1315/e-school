<?php

namespace App\Http\Controllers;

use App\Http\Resources\SchoolResource;
use App\Models\Permission;
use App\Models\Role;
use App\Models\School;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SchoolController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        $schools = School::latest()->get();
        return Inertia::render('School/List', [
            'schools' => SchoolResource::collection($schools),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('School/Create');
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "raison_sociale" => "required",
                "adresse" => "nullable",

                "email" => "required",
                "phone" => "required",

                "logo" => "required",
                "ifu" => "nullable",
                "rccm" => "nullable",

                "slogan" => "required",
                "description" => "required"
            ], [
                "raison_sociale.required" => "Le nom rest réquis",

                "email.required" => "Le mail est réquis!",
                "phone.required" => "Le numéro de telephone est réquis!",

                "logo.required" => "Le logo est réquis!",

                "slogan.required" => "Le slogan est réquis",
                "description.required" => "La description est réquis"
            ]);

            DB::beginTransaction();

            $school = School::create($validated);

            /**
             * Generation des rôles
             */
            $school->roles()->attach(Role::where('id', '!=', 1)->get()->pluck("id")->toArray());

            /**
             * Generation des permissions
             */
            $school->permissions()->attach(Permission::get()->pluck("id")->toArray());

            /*** */

            DB::commit();
            return redirect()->route("school.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(School $school)
    {
        return Inertia::render('School/Update', [
            'school' => $school,
        ]);
    }

    /**
     * Update
     */
    public function update(Request $request, School $school)
    {
        Log::debug("Les datas entrantes", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "raison_sociale" => "required|string|max:255",
                "adresse" => "nullable|string|max:255",
                "email" => "required|email|unique:schools,email," . $school->id,
                "phone" => "required|string|max:20",
                "logo" => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
                "ifu" => "nullable|string|max:50",
                "rccm" => "nullable|string|max:50",
                "slogan" => "required|string|max:255",
                "description" => "required|string",
                "statut" => "nullable|boolean"
            ], [
                "raison_sociale.required" => "Le nom est requis.",
                "email.required" => "Le mail est requis.",
                "email.unique" => "Ce mail est déjà utilisé.",
                "phone.required" => "Le numéro de téléphone est requis.",
                "slogan.required" => "Le slogan est requis.",
                "description.required" => "La description est requise.",

                // 🖼️ Messages d'erreurs du logo :
                "logo.image" => "Le fichier du logo doit être une image.",
                "logo.mimes" => "Le logo doit être au format : jpeg, png, jpg, gif ou svg.",
                "logo.max" => "La taille du logo ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            $validated["statut"] = $request->statut ? true : false;

            $school->update($validated);

            DB::commit();

            return redirect()
                ->route("school.index")
                ->with("success", "L'école a été mise à jour avec succès !");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error("Erreur de validation lors de la mise à jour de l'école", [
                "errors" => $e->errors()
            ]);
            return back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors de la mise à jour de l'école", [
                "error" => $e->getMessage()
            ]);
            return back()
                ->withErrors(["exception" => "Une erreur est survenue : " . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
    }
}
