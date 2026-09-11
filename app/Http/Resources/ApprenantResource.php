<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class ApprenantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $anneeScolaireCourante = now()->year;

        $scolarite = $this->classe?->scolarite ?? 0;

        $montantPaye = $this->payements()
            ->where("annee_scolaire", $anneeScolaireCourante)
            ->sum("montant") ?? 0;

        $resteApayer = $scolarite - $montantPaye;

        Log::debug("Le scolarite :", ["scolarite" => $scolarite]);
        Log::debug("Les payements :", ["payements" => $montantPaye]);
        Log::debug("Le resteApayer :", ["resteApayer" => $resteApayer]);

        return [
            "id" => $this->id,

            "parent" => $this->parent,
            "school" => $this->school,
            "classe" => $this->classe,
            "serie" => $this->classe?->serie,

            "restToPay" => $resteApayer,

            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "adresse" => $this->adresse,

            "email" => $this->email,
            "phone" => $this->phone,
            "date_naissance" => Carbon::parse($this->date_naissance)->locale('fr')->isoFormat("D MMMM YYYY"),
            "lieu_naissance" => $this->lieu_naissance,
            "sexe" => $this->sexe,
            "photo" => $this->photo,
            "educ_master" => $this->educ_master,
        ];
    }
}