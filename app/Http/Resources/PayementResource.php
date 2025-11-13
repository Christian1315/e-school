<?php

namespace App\Http\Resources;

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
            "school" => $this->school, //SchoolResource::collection($this->school),
            "apprenant" => $this->apprenant, //ApprenantResource::collection($this->apprenant),
            "montant" => $this->montant,
            "paiement_receit" => $this->paiement_receit,
            "createdBy" => $this->createdBy,
        ];
    }
}
