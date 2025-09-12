<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classe>
 */
class ClasseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "libelle" => fake()->randomElement(["6 ième", "5 ième", "4 ième", "3 ième", "2 nde", " 1 ère", "Tle"]),
            // "school_id" => fake()->numberBetween(1, 10),
            // "created_by" => fake()->numberBetween(1, 10),
            // "updated_by" => fake()->numberBetween(1, 10)
        ];
    }
}
