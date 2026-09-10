<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "classes" => $this->classes
                ->loadMissing("classe")
                ->map(function ($affectation) {
                    $classe = $affectation->classe;

                    if (!$classe) {
                        return null;
                    }

                    return array_merge($classe->toArray(), [
                        "affectation_id" => $affectation->id,
                        "classe_id" => $affectation->classe_id,
                        "professeur_id" => $affectation->professeur_id,
                        "matiere_id" => $affectation->matiere_id,
                        "coefficient" => $affectation->coefficient,
                    ]);
                })
                ->filter()
                ->unique("id")
                ->values(),
            "matieres" => $this->matieres
                ->loadMissing("matiere")
                ->map(function ($affectation) {
                    $matiere = $affectation->matiere;

                    if (!$matiere) {
                        return null;
                    }

                    return array_merge($matiere->toArray(), [
                        "affectation_id" => $affectation->id,
                        "classe_id" => $affectation->classe_id,
                        "professeur_id" => $affectation->professeur_id,
                        "matiere_id" => $affectation->matiere_id,
                        "coefficient" => $affectation->coefficient,
                    ]);
                })
                ->filter()
                ->unique("id")
                ->values(),
            "email" => $this->email,
            "detail" => $this->detail, //DetailResource::collection($this->detail),
            "roles" => $this->roles, //DetailResource::collection($this->detail),
            "created_at" => Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY"), //DetailResource::collection($this->detail),
        ];
    }
}
