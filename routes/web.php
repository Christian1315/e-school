<?php

use App\Http\Controllers\ApprenantController;
use App\Http\Controllers\BulletinController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevoirController;
use App\Http\Controllers\HomeController;
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
use Illuminate\Support\Facades\Route;


/**Unprotected routes */
Route::get('/', [HomeController::class, "index"])->name('home');
Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

// contact
Route::resource("contact", ContactController::class);

/**protected routes */
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
    Route::get("devoir/get-store-multiple", [DevoirController::class, "getStoreMultiple"])->name("devoir.get-store-multiple");
    Route::resource("devoir", DevoirController::class);
    Route::patch("devoir/{devoir}/valide", [DevoirController::class, "validate"])->name("devoir.valide");
    Route::post("devoir/post-store-multiple", [DevoirController::class, "postStoreMultiple"])->name("devoir.post-store-multiple");
    Route::post("devoir/validate-multiple", [DevoirController::class, "validateMultiple"])->name("devoir.validate-multiple");

    // Interrogations d'apprenants
    Route::get("interrogation/get-store-multiple", [InterrogationController::class, "getStoreMultiple"])->name("interrogation.get-store-multiple");
    Route::resource("interrogation", InterrogationController::class);
    Route::patch("interrogation/{interrogation}/valide", [InterrogationController::class, "validate"])->name("interrogation.valide");
    Route::post("interrogation/post-store-multiple", [InterrogationController::class, "postStoreMultiple"])->name("interrogation.post-store-multiple");
    Route::post("interrogation/validate-multiple", [InterrogationController::class, "validateMultiple"])->name("interrogation.validate-multiple");

    // Schools
    Route::resource("school", SchoolController::class)->except("update");
    Route::post("school/update/{school}", [SchoolController::class, "update"])->name("school.update");

    //Utilisateurs
    Route::resource("user", UserController::class)->except("update");
    Route::post("user/update/{user}", [UserController::class, "update"])->name("user.update");
    Route::post("user/import", [UserController::class, "importUsers"])->name("user.import");

    // Parents
    Route::get("parent", [UserController::class, "parents"])->name("parent.index");
    Route::post("parent/import", [UserController::class, "importParents"])->name("parent.import");

    // Professeurs
    Route::get("professeur", [UserController::class, "professeurs"])->name("professeur.index");
    Route::post("professeur/import", [UserController::class, "importProfesseurs"])->name("professeur.import");

    // Apprenants
    Route::resource("apprenant", ApprenantController::class)->except("update");
    Route::post("apprenant/update/{apprenant}", [ApprenantController::class, "update"])->name("apprenant.update");
    Route::post("apprenant/import", [ApprenantController::class, "importApprenants"])->name("apprenant.import");

    // Inscriptions
    Route::resource("inscription", InscriptionController::class)->except("update");
    Route::post("inscription/update/{inscription}", [InscriptionController::class, "update"])->name("inscription.update");
    Route::get("/inscription/generate-receit/{inscription}/{reste}", [InscriptionController::class, "generateReceit"])->name("inscription.generate-receit");

    // Paiements
    Route::resource("paiement", PayementController::class);
    Route::get("/paiement/generate-receit/{paiement}", [PayementController::class, "generateReceit"])->name("paiement.generate-receit");

    //Les moyennes 
    Route::prefix("moyennes")->group(function () {
        // Moyennes des interrogations
        Route::get("interro/{trimestre}/{annee_scolaire?}", MoyenneInterrogationController::class)->name("moyenne.interro");

        // Moyennes des devoirs
        Route::get("devoir/{trimestre}/{annee_scolaire?}", MoyenneDevoirController::class)->name("moyenne.devoir");
    });

    // Les bulletins
    Route::get("bulletin/{trimestre}", BulletinController::class)->name("bulletin");
    Route::get("bulletin/{trimestre}/{apprenant}/{annee_scolaire?}", [BulletinController::class, "generateBulletin"])->name("generateBulletin");

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Roles
    Route::resource("role", RoleController::class)->except("update");
    Route::get("role/{id}/permissions", [RoleController::class, 'getPermissions'])->name("role.permissions");
    Route::get("role/{id}/users", [RoleController::class, 'getUsers'])->name("role.users");
    Route::post("role/affect", [RoleController::class, 'affectRole'])->name("affect.role");

    Route::post("role/{id}/update-permissions", [RoleController::class, 'updatePermissions'])->name("role.update.permissions");
    Route::post("role/{id}/update-users", [RoleController::class, 'updateUsers'])->name("role.update.users");
});

require __DIR__ . '/auth.php';
