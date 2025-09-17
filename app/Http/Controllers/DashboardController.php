<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\InscriptionResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\UserResource;
use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if (Auth::user()->school) {
            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $inscriptions = Inscription::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $users = User::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::latest()->get();
            $inscriptions = Inscription::latest()->get();
            $users = User::latest()->get();
        }

        // dd(UserResource::collection($users));
        return Inertia::render('Dashboard', [
            "apprenants" => ApprenantResource::collection($apprenants),
            "inscriptions" => InscriptionResource::collection($inscriptions),
            "users" => UserResource::collection($users),
            "schools" => SchoolResource::collection(School::all()), 
        ]);
    }
}
