<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterrogationResource extends JsonResource
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
            "apprenant" => $this->apprenant,
            "trimestre" => $this->trimestre,
            "matiere" => $this->matiere,
            "note" => $this->note,
        ];
    }
}
