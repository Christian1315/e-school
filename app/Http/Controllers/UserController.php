<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Imports\ParentImport;
use App\Imports\ProfesseurImport;
use App\Imports\UsersImport;
use App\Models\Apprenant;
use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    /**
     * Index
     */
    function index()
    {
        if (Auth::user()->school) {
            $users = User::with("roles")
                ->where("school_id",  Auth::user()->school_id)->get();

            $roles = Role::with(['school'])
                ->where('id', '!=', 1)
                ->whereNotIn('name', Auth::user()->roles->pluck('name')->toArray())
                ->latest()
                ->get();
        } else {
            $users = User::with("roles")->get();

            $roles = Role::with(['school'])
                ->where('id', '!=', 1)
                ->latest()->get();
        }

        return Inertia::render('User/List', [
            'users' => UserResource::collection($users),
            'roles' => $roles,
        ]);
    }

    /**
     * Parents
     */
    function parents()
    {
        $school = Auth::user()->school ?? School::with("roles")->first();
        if ($school) {
            $parentsQuery = User::whereHas("roles", fn($query) => $query->where("name", "Parent"))
                ->where("school_id",  $school->id);
        } else {
            $parentsQuery = User::whereHas("roles", fn($query) => $query->where("name", 'Parent'));
        }

        return Inertia::render('Apprenant/Parent', [
            'users' => UserResource::collection($parentsQuery->get()),
        ]);
    }

    /**
     * Professeurs
     */
    function professeurs()
    {
        $school = Auth::user()->school ?? School::with("roles")->first();
        if ($school) {
            $parentsQuery = User::whereHas("roles", fn($query) => $query->where("name", "Professeur"))
                ->where("school_id",  $school->id);
        } else {
            $parentsQuery = User::whereHas("roles", fn($query) => $query->where("name", 'Professeur'));
        }

        return Inertia::render('Apprenant/Professeur', [
            'users' => UserResource::collection($parentsQuery->get()),
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        if (Auth::user()->school) {
            $schools = School::where("id", Auth::user()->school_id)->get();
            $roles = Auth::user()->school->roles()->with("school")->get();
        } else {
            $schools = School::latest()->get();
            $roles = Role::with("school")->where("id", "!=", 1)->get();
        }

        return Inertia::render('User/Create', [
            "schools" => $schools,
            "roles" => $roles
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
                'firstname'   => 'required|string',
                'lastname'    => 'required|string',
                'school_id'   => 'required|integer',
                'role_id'   => 'required|integer',

                'email'       => 'required|string|lowercase|email|max:255|unique:users,email',
                'password'    => ['required', 'confirmed', Rules\Password::defaults()],

                'phone'       => 'nullable|string',
                'profile_img' => 'nullable|image|mimes:png,jpeg',
            ], [
                // 🔹 Messages personnalisés
                'firstname.required'   => 'Le prénom est obligatoire.',
                'firstname.string'     => 'Le prénom doit être une chaîne de caractères.',

                'lastname.required'    => 'Le nom est obligatoire.',
                'lastname.string'      => 'Le nom doit être une chaîne de caractères.',

                'school_id.required'   => "L'identifiant de l'école est obligatoire.",
                'school_id.integer'    => "L'identifiant de l'école doit être un nombre.",

                'role_id.required'   => "Le rôle est obligatoire.",
                'role_id.integer'    => "Le rôle doit être un nombre.",

                'email.required'       => "L'adresse email est obligatoire.",
                'email.string'         => "L'adresse email doit être une chaîne de caractères.",
                'email.lowercase'      => "L'adresse email doit être en minuscules.",
                'email.email'          => "L'adresse email n'est pas valide.",
                'email.max'            => "L'adresse email ne doit pas dépasser 255 caractères.",
                'email.unique'         => "Cette adresse email est déjà utilisée.",

                'password.required'    => "Le mot de passe est obligatoire.",
                'password.confirmed'   => "La confirmation du mot de passe ne correspond pas.",
                'password.min'         => "Le mot de passe doit contenir au moins 8 caractères.",

                // 'phone.required'       => "Le numéro de téléphone est obligatoire.",
                'phone.string'         => "Le numéro de téléphone doit être une chaîne de caractères.",

                'profile_img.image'    => "Le fichier doit être une image.",
                'profile_img.mimes'    => "L'image doit être au format PNG ou JPEG.",
            ]);

            DB::beginTransaction();

            $user = User::create([
                'firstname' => $validated["firstname"],
                'lastname' => $validated["lastname"],
                'email' => $validated["email"],
                'school_id' => $validated["school_id"],
                'password' => Hash::make($validated["password"]),
            ]);

            $user->detail()->create(["phone" => $validated["phone"] ?? null]);


            /**
             * Affectation de role
             */
            $role = Role::find($validated["role_id"]);
            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas");
            }

            /**
             *  On supprime tous les anciens liens et on garde seulement ceux envoyés
             * */
            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->delete();

            /**
             * Affectation
             */
            $user->assignRole($role);

            event(new Registered($user));

            DB::commit();
            return redirect()->route("user.index");
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
     * Importation des parents
     */
    function importParents(Request $request)
    {
        try {
            $request->validate(
                [
                    'parents' => 'required|file|mimes:xlsx,xls|max:5120',
                ],
                [
                    'parents.required' => 'Le fichier est obligatoire.',
                    'parents.file'     => 'Vous devez envoyer un fichier valide.',
                    'parents.mimes'    => 'Le fichier doit être au format : .xlsx ou .xls.',
                    'parents.max'      => 'Le fichier ne doit pas dépasser 5 Mo.',
                ]
            );

            $parents = $request->file('parents');

            DB::beginTransaction();

            Excel::import(new ParentImport, $parents);

            DB::commit();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur générale lors de l'import", [
                'erreur' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Importation des professeurs
     */
    function importProfesseurs(Request $request)
    {
        try {
            $request->validate(
                [
                    'professeurs' => 'required|file|mimes:xlsx,xls|max:5120',
                ],
                [
                    'professeurs.required' => 'Le fichier est obligatoire.',
                    'professeurs.file'     => 'Vous devez envoyer un fichier valide.',
                    'professeurs.mimes'    => 'Le fichier doit être au format : .xlsx ou .xls.',
                    'professeurs.max'      => 'Le fichier ne doit pas dépasser 5 Mo.',
                ]
            );

            $professeurs = $request->file('professeurs');

            DB::beginTransaction();

            Excel::import(new ProfesseurImport, $professeurs);

            DB::commit();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur générale lors de l'import", [
                'erreur' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Importation des utilisateurs
     */
    function importUsers(Request $request)
    {
        try {
            $request->validate(
                [
                    'users' => 'required|file|mimes:xlsx,xls|max:5120',
                ],
                [
                    'users.required' => 'Le fichier est obligatoire.',
                    'users.file'     => 'Vous devez envoyer un fichier valide.',
                    'users.mimes'    => 'Le fichier doit être au format : .xlsx ou .xls.',
                    'users.max'      => 'Le fichier ne doit pas dépasser 5 Mo.',
                ]
            );

            $users = $request->file('users');

            DB::beginTransaction();

            Excel::import(new UsersImport, $users);

            DB::commit();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur générale lors de l'import", [
                'erreur' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(User $user)
    {
        $user->load("roles");

        if (Auth::user()->school) {
            $schools = School::where("id", Auth::user()->school_id)->get();
            $roles = Auth::user()->school->roles()->with("school")->get();
        } else {
            $schools = School::latest()->get();
            $roles = Role::with("school")->where("id", "!=", 1)->get();
        }

        return Inertia::render('User/Update', [
            "schools" => $schools,
            "roles" => $roles,
            "user" => $user,
            "role" => $user->roles->first()
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, User $user)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {

            if (!$user) {
                throw new \Exception("Cet utilisateur n'existe pas!");
            }

            $validated = $request->validate([
                'firstname'   => 'required|string',
                'lastname'    => 'required|string',
                'school_id'   => 'nullable|integer',
                'role_id'   => 'nullable|integer',

                'email'       => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
                'password'    => ['nullable', 'confirmed', Rules\Password::defaults()],

                'phone'       => 'required|string',
                'profile_img' => 'nullable|image|mimes:png,jpeg',
            ], [
                // 🔹 Messages personnalisés
                'firstname.required'   => 'Le prénom est obligatoire.',
                'firstname.string'     => 'Le prénom doit être une chaîne de caractères.',

                'lastname.required'    => 'Le nom est obligatoire.',
                'lastname.string'      => 'Le nom doit être une chaîne de caractères.',

                'role_id.required'   => "Le rôle est obligatoire.",
                'role_id.integer'    => "Le rôle doit être un nombre.",

                'email.required'       => "L'adresse email est obligatoire.",
                'email.string'         => "L'adresse email doit être une chaîne de caractères.",
                'email.lowercase'      => "L'adresse email doit être en minuscules.",
                'email.email'          => "L'adresse email n'est pas valide.",
                'email.max'            => "L'adresse email ne doit pas dépasser 255 caractères.",
                'email.unique'         => "Cette adresse email est déjà utilisée.",

                // 'password.required'    => "Le mot de passe est obligatoire.",
                'password.confirmed'   => "La confirmation du mot de passe ne correspond pas.",
                'password.min'         => "Le mot de passe doit contenir au moins 8 caractères.",

                'phone.required'       => "Le numéro de téléphone est obligatoire.",
                'phone.string'         => "Le numéro de téléphone doit être une chaîne de caractères.",

                'profile_img.image'    => "Le fichier doit être une image.",
                'profile_img.mimes'    => "L'image doit être au format PNG ou JPEG.",
            ]);

            DB::beginTransaction();

            $user->update($validated);

            Log::debug("Les détails : ", ["details" => $user->detail]);
            if ($user->detail) {
                $user->detail()->update(["phone" => $validated["phone"] ?? null, "profile_img" => $user->detail->handlePhoto() ?? $user->detail->profile_img]);
            } else {
                $user->detail()->create(["phone" => $validated["phone"] ?? null, "profile_img" => $user->detail->handlePhoto() ?? $user->detail->profile_img]);
            }

            /**
             * Affectation de role
             */
            $role = Role::find($validated["role_id"]);
            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas");
            }

            /**
             *  On supprime tous les anciens liens et on garde seulement ceux envoyés
             * */
            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->delete();

            /**
             * Affectation
             */
            $user->assignRole($role);

            event(new Registered($user));

            DB::commit();
            return redirect()->back();;
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'utilisateur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'utilisateur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(User $user)
    {
        Log::debug("Suppression de l'utilisateur", ["user_id" => $user->id]);
        try {
            DB::beginTransaction();

            $user->delete();
            DB::commit();
            return redirect()->back()
                ->with("success", "Suppression éffectuée avec succès!");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
