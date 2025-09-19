<?php

use App\Http\Controllers\ApprenantController;
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
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\TrimestreController;
use App\Http\Controllers\UserController;
use App\Models\Apprenant;
// use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get("/debug", function () {

    if (Auth::user()->school) {
        $apprenants = Apprenant::with(["school", "parent"])->latest()
            ->where("school_id", Auth::user()->school_id)->get();
    } else {
        $apprenants = Apprenant::with(["school", "parent"])->latest()->get();
    }


    /**
     * Moyennes formatage
     */
    $apprenants->transform(function ($apprenant) {
        $matieres = $apprenant->school->matieres;

        $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant) {
            $matiere_interros = $apprenant->interrogations()->where("matiere_id", $matiere->id)->get();
            return [
                "id" => $matiere->id,
                "libelle" => $matiere->libelle,
                "interrogations" => $matiere_interros,
                "moyenne_interro" => !$matiere_interros->isEmpty() ? $matiere_interros->sum("note") / $matiere_interros->count() : 0
            ];
        });

        return $apprenant;
    });

    return response()->json($apprenants);

    Mail::raw('Ceci est un test', function ($message) {
        $message->to('gogochristian009@gmail.com')->subject('Test mail Laravel');
    });

    return "mail envoyé";
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

    // Apprenants
    Route::resource("apprenant", ApprenantController::class);

    // Inscriptions
    Route::resource("inscription", InscriptionController::class);
    Route::get("/inscription/generate-receit/{inscription}/{reste}", [InscriptionController::class, "generateReceit"])->name("inscription.generate-receit");

    // Paiements
    Route::resource("paiement", PayementController::class);
    Route::get("/paiement/generate-receit/{paiement}", [PayementController::class, "generateReceit"])->name("paiement.generate-receit");

    //Les moyennes 
    Route::prefix("moyennes")->group(function () {
        // Moyennes des interrogations
        Route::get("interro", MoyenneInterrogationController::class)->name("moyenne.interro");

        // Moyennes des devoirs
        Route::get("devoir", MoyenneDevoirController::class)->name("moyenne.devoir");
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
