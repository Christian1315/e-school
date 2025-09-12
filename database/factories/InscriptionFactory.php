<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inscription>
 */
class InscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // "school_id" => fake()->numberBetween(1, 10),
            // "apprenant_id" => fake()->numberBetween(1, 10),
            // "created_by" => fake()->numberBetween(1, 10),
            // "updated_by" => fake()->numberBetween(1, 10),

            "numero_educ_master" => "EDU-" . fake()->numberBetween(1000, 9999),
            "dossier_transfert" => fake()->imageUrl(),
            "frais_inscription" => fake()->randomFloat(20000, 200000)
        ];
    }
}
