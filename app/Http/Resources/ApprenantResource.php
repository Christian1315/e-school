<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprenantResource extends JsonResource
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

            "parent"=>$this->parent,//UserResource::collection($this->parent),
            "school"=>$this->school,//SchoolResource::collection($this->school),
            "classe"=>$this->classe,//ClasseResource::collection($this->classe),

            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "adresse" => $this->adresse,

            "email" => $this->email,
            "phone" => $this->phone,
            "date_naissance" => Carbon::parse($this->date_naissance)->locale('fr')->isoFormat("D MMMM YYYY"),
            "lieu_naissance" => $this->lieu_naissance,
            "sexe" => $this->sexe,
            "photo" => $this->photo,
        ];
    }
}
