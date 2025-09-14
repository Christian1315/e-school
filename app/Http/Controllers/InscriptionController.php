<?php

namespace App\Http\Controllers;

use App\Http\Resources\InscriptionResource;
use App\Models\Inscription;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InscriptionController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        $inscriptions = Inscription::all();
        return Inertia::render('Inscription/List', [
            'inscriptions' => InscriptionResource::collection($inscriptions),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('Inscription/Create');
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Generate receit
     */

    function generateReceit(Inscription $inscription, $reste)
    {
        $inscription->load(["school", "apprenant.parent.detail","apprenant.classe"]);

        set_time_limit(0);
        $pdf = Pdf::loadView("pdfs.souscriptions.receit", [
            "inscription" => $inscription,
            "reste" => $reste
        ]);

        // Set PDF orientation to landscape
        $pdf->setPaper('a4', 'landscape');

        return $pdf->stream();
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }
}
