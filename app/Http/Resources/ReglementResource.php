<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReglementResource extends JsonResource
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
            "school" => $this->school,
            "transactionId" => $this->transactionId,
            "montant" => number_format($this->montant,2,","," "),
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "annee_scolaire" => $this->annee_scolaire,
            "validatedAt" => $this->validated_at ? Carbon::parse($this->validated_at)->locale("fr")->isoFormat("D MMMM YYYY") : '---',
            "created_at" => $this->created_at ? Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY") : '---',
        ];
    }
}
