<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Apprenant;
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

class UserController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        if (Auth::user()->school) {
            $users = User::where("school_id",  Auth::user()->school_id)->get();
        } else {
            $users = User::all();
        }
        return Inertia::render('User/List', [
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        if (Auth::user()->school) {
            $schools = School::where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('User/Create', [
            "schools" => $schools,
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

                'email'       => 'required|string|lowercase|email|max:255|unique:users,email',
                'password'    => ['required', 'confirmed', Rules\Password::defaults()],

                'phone'       => 'required|string',
                'profile_img' => 'nullable|image|mimes:png,jpeg',
            ], [
                // 🔹 Messages personnalisés
                'firstname.required'   => 'Le prénom est obligatoire.',
                'firstname.string'     => 'Le prénom doit être une chaîne de caractères.',

                'lastname.required'    => 'Le nom est obligatoire.',
                'lastname.string'      => 'Le nom doit être une chaîne de caractères.',

                'school_id.required'   => "L'identifiant de l'école est obligatoire.",
                'school_id.integer'    => "L'identifiant de l'école doit être un nombre.",

                'email.required'       => "L'adresse email est obligatoire.",
                'email.string'         => "L'adresse email doit être une chaîne de caractères.",
                'email.lowercase'      => "L'adresse email doit être en minuscules.",
                'email.email'          => "L'adresse email n'est pas valide.",
                'email.max'            => "L'adresse email ne doit pas dépasser 255 caractères.",
                'email.unique'         => "Cette adresse email est déjà utilisée.",

                'password.required'    => "Le mot de passe est obligatoire.",
                'password.confirmed'   => "La confirmation du mot de passe ne correspond pas.",
                'password.min'         => "Le mot de passe doit contenir au moins 8 caractères.",

                'phone.required'       => "Le numéro de téléphone est obligatoire.",
                'phone.string'         => "Le numéro de téléphone doit être une chaîne de caractères.",

                'profile_img.image'    => "Le fichier doit être une image.",
                'profile_img.mimes'    => "L'image doit être au format PNG ou JPEG.",
            ]);


            $user = User::create([
                'firstname' => $validated["firstname"],
                'lastname' => $validated["lastname"],
                'email' => $validated["email"],
                'school_id' => $validated["school_id"],
                'password' => Hash::make($validated["password"]),
            ]);

            $user->detail()->create(["phone" => $validated["phone"]]);

            event(new Registered($user));

            DB::beginTransaction();

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
