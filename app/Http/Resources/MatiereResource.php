<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatiereResource extends JsonResource
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
            "school" => $this->school,
            "classes" => $this->classes,
            "professeurs"=>$this->professeurs,
            "libelle" => $this->libelle,
            "coefficient" => $this->coefficient,
            "professeur" => $this->professeur?->professeur
        ];
    }
}
