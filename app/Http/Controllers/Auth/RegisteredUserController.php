<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            Log::debug("Debut du traitement de la création d'un compte", ["data" => $request->all()]);
            /****
             * Traitement de l'école
             */

            // validation
            $schoolValidated = $request->validate([
                "raison_sociale" => "required",
                "adresse" => "nullable",

                "email" => "required|unique:schools,email",
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

            // creation de l'école
            $school = School::create($schoolValidated);

            // Generation des rôles
            $baseRoles = Role::whereNull("school_id")->get()
                ->map(fn($role) => ["name" => $role->name]);

            $school->roles()
                ->createMany($baseRoles);

            /**
             * Traitement de l'administrateur
             */

            $adminValidated = $request->validate([
                'firstname'   => 'required|string',
                'lastname'    => 'required|string',

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

            
            $request->merge(["school_id" => $school->id]);

            $user = User::create([
                'firstname' => $adminValidated["firstname"],
                'lastname' => $adminValidated["lastname"],
                'email' => $adminValidated["email"],
                'school_id' => $school->id,
                'password' => Hash::make($adminValidated["password"]),
            ]);

            $user->detail()->create([
                "phone" => $adminValidated["phone"] ?? null,
            ]);

            /**
             * Affectation de role
             */
            $role = $school->roles()
                ->firstWhere("name", "Super Administrateur");
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

            // connexion automatique

            Auth::login($user);

            DB::commit();
            Log::info("Compte generé avec succès", ["data" => $user]);
            return redirect()->route("dashboard");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'enregistrement", ["data" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure d'exception lors de l'enregistrement", ["data" => $e->getMessage()]);
            return back()->with(["exception" => $e->getMessage()]);
        }
    }
}
