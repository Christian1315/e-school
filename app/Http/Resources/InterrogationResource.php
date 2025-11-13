<?php

namespace App\Http\Resources;

use Carbon\Carbon;
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
            "is_validated" => $this->is_validated,
            "apprenant" => $this->apprenant,
            "trimestre" => $this->trimestre,
            "matiere" => $this->matiere,
            "note" => $this->note,
            "createdAt" => Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY"),
            "createdBy" => $this->createdBy,
        ];
    }
}
