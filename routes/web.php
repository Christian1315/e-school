<?php

use App\Http\Controllers\ApprenantController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\PayementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\UserController;
// use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/mail", function () {
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


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
