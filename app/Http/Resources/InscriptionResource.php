<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            "id" => $this->id,
            "numero" => $this->numero,
            "receipted" => $this->receipted,
            "school" => $this->school, //SchoolResource::collection($this->school),
            "apprenant" => $this->apprenant, //ApprenantResource::collection($this->apprenant),
            "createdBy" => $this->createdBy, //UserResource::collection($this->createdBy),
            "updatedBy" => $this->updatedBy, //UserResource::collection($this->updatedBy),
            "numero_educ_master" => $this->numero_educ_master,
            "annee_scolaire" => $this->annee_scolaire,
            "dossier_transfert" => $this->dossier_transfert,
            "frais_inscription" => number_format($this->frais_inscription, 2, ".", " "),
        ];
    }
}
