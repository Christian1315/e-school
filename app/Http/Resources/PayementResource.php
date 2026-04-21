<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            "id" => $this->id,
            "numero" => $this->numero,
            "receipted" => $this->receipted,
            "date_paiement" => $this->date_paiement ? Carbon::parse($this->date_paiement)->locale('fr')->isoFormat("D MMMM YYYY") : '',
            "annee_scolaire" => $this->annee_scolaire,
            "school" => $this->school, //SchoolResource::collection($this->school),
            "apprenant" => $this->apprenant, //ApprenantResource::collection($this->apprenant),
            "montant" => $this->montant,
            "paiement_receit" => $this->paiement_receit,
            "createdBy" => $this->createdBy,
        ];
    }
}
