<?php

namespace App\Http\Controllers;

use App\Http\Resources\SchoolResource;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        $schools = School::all();
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
     * Edit
     */
    function edit(Request $request)
    {
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
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
