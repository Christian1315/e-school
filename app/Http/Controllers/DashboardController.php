<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\InscriptionResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\UserResource;
use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\Reglement;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Laravel\Prompts\number;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $user = Auth::user();
        if ($user && !$user->hasRole(["Super Administrateur", "Administrateur"])) {
            return response()->json(["error" => "Vous n'êtes pas autorisé.e à accéder à ce panel!"]);
        }

        if ($user->school) {
            $apprenants = Apprenant::latest()
                ->where("school_id", $user->school_id)->get();

            $inscriptions = Inscription::latest()
                ->where("school_id", $user->school_id)->get();

            $users = User::latest()
                ->where("school_id", $user->school_id)->get();

            $reglements = Reglement::where("school_id", $user->school_id)
                ->get();
        } else {
            $apprenants = Apprenant::latest()->get();
            $inscriptions = Inscription::latest()->get();
            $users = User::latest()->get();

            $reglements = Reglement::latest()->get();
        }

        $factureAmount = env("UNITY_PRICE") * $apprenants->count();
        $reglementAmount = $reglements->sum("montant");
        $dette = $factureAmount - $reglementAmount;

        return Inertia::render('Dashboard', [
            "apprenants" => ApprenantResource::collection($apprenants),
            "inscriptions" => InscriptionResource::collection($inscriptions),
            "users" => UserResource::collection($users),
            "schools" => SchoolResource::collection(School::all()),
            "factureAmount" => number_format($factureAmount,2,","," ") ,
            "reglementAmount" => number_format($reglementAmount,2,","," ") ,
            "dette"=> number_format($dette,2,","," ")
        ]);
    }
}
