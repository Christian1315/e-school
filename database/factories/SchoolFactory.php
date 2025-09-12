<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\School>
 */
class SchoolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "raison_sociale"=>fake()->name(),
            "adresse"=>fake()->address(),

            "email"=>fake()->unique()->safeEmail(),
            "phone"=>fake()->phoneNumber(),

            "logo"=>fake()->imageUrl(),
            "ifu"=> "IFU-".fake()->word()."xxx",
            "rccm"=>"IFU-".fake()->word()."xxx",
            "statut"=>fake()->boolean(),
        ];
    }
}
