<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class PayementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "numero" => $this->numero,
            "receipted" => $this->receipted,
            "date_paiement" => $this->date_paiement ? Carbon::parse($this->date_paiement)->locale('fr')->isoFormat("D MMMM YYYY") : '',
            "annee_scolaire" => $this->annee_scolaire,
            "school" => $this->school,
            "apprenant" => $this->apprenant->load(["classe.serie"]),
            "montant" => $this->montant,
            "paiement_receit" => $this->paiement_receit,
            "createdBy" => $this->createdBy,
        ];
    }
}
