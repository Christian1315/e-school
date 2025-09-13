<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Models\Apprenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprenantController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        $schools = Apprenant::all();
        return Inertia::render('Apprenant/List', [
            'apprenants' => ApprenantResource::collection($schools),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('Apprenant/Create');
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
