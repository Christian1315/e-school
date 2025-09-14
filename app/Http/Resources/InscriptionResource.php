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
            "school" => $this->school, //SchoolResource::collection($this->school),
            "apprenant" => $this->apprenant, //ApprenantResource::collection($this->apprenant),
            "createdBy" => $this->createdBy, //UserResource::collection($this->createdBy),
            "updatedBy" => $this->updatedBy, //UserResource::collection($this->updatedBy),
            "numero_educ_master" => $this->numero_educ_master,
            "dossier_transfert" => $this->dossier_transfert,
            "frais_inscription" => $this->frais_inscription,
        ];
    }
}
