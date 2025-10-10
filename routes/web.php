<?php

use App\Http\Controllers\ApprenantController;
use App\Http\Controllers\BulletinController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevoirController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\InterrogationController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\MoyenneDevoirController;
use App\Http\Controllers\MoyenneInterrogationController;
use App\Http\Controllers\PayementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SerieController;
use App\Http\Controllers\TrimestreController;
use App\Http\Controllers\UserController;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/{roleId}/affect-permissions", function ($roleId) {
    
    $role = Role::findOrFail($roleId);

    if (!$role) {
        return "Ce role n'existe pas";
    }
    $permissions = Permission::all();
    $role->syncPermissions($permissions->pluck("name"));
    return "Permissions affectées avec succès";
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    /***
     * LES PARAMETRAGES
     */

    // Classes d'apprenants
    Route::resource("classe", ClasseController::class);

    // Serie d'école
    Route::resource("serie", SerieController::class);

    // Trimestres d'écoles
    Route::resource("trimestre", TrimestreController::class);

    // Matières d'écoles
    Route::resource("matiere", MatiereController::class);

    // Devoirs d'apprenants
    Route::resource("devoir", DevoirController::class);

    // Interrogations d'apprenants
    Route::resource("interrogation", InterrogationController::class);

    // Schools
    Route::resource("school", SchoolController::class);

    // Users
    Route::resource("user", UserController::class);
    Route::post("user/import", [UserController::class, "importUsers"])->name("user.import");
    Route::get("parent", [UserController::class, "parents"])->name("parent.index");
    Route::post("parent/import", [UserController::class, "importParents"])->name("parent.import");

    // Apprenants
    Route::resource("apprenant", ApprenantController::class);
    Route::post("apprenant/import", [ApprenantController::class, "importApprenants"])->name("apprenant.import");

    // Inscriptions
    Route::resource("inscription", InscriptionController::class);
    Route::get("/inscription/generate-receit/{inscription}/{reste}", [InscriptionController::class, "generateReceit"])->name("inscription.generate-receit");

    // Paiements
    Route::resource("paiement", PayementController::class);
    Route::get("/paiement/generate-receit/{paiement}", [PayementController::class, "generateReceit"])->name("paiement.generate-receit");

    //Les moyennes 
    Route::prefix("moyennes")->group(function () {
        // Moyennes des interrogations
        Route::get("interro/{trimestre}", MoyenneInterrogationController::class)->name("moyenne.interro");

        // Moyennes des devoirs
        Route::get("devoir/{trimestre}", MoyenneDevoirController::class)->name("moyenne.devoir");
    });

    // Les bulletins
    Route::get("bulletin/{trimestre}", BulletinController::class)->name("bulletin");
    Route::get("bulletin/{trimestre}/{apprenant}", [BulletinController::class, "generateBulletin"])->name("generateBulletin");

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Roles
    Route::resource("role", RoleController::class)->except("update");
    Route::get("role/{id}/permissions", [RoleController::class, 'getPermissions'])->name("role.permissions");
    Route::get("role/{id}/users", [RoleController::class, 'getUsers'])->name("role.users");
    Route::post("role/affect", [RoleController::class, 'affectRole'])->name("affect.role");

    Route::patch("role/{id}/update-permissions", [RoleController::class, 'updatePermissions'])->name("role.update.permissions");
    Route::patch("role/{id}/update-users", [RoleController::class, 'updateUsers'])->name("role.update.users");
});

require __DIR__ . '/auth.php';
