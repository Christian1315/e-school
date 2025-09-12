<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trimestre>
 */
class TrimestreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "libelle" => fake()->randomElement(["1 Trimestre", "2 Trimestre", "3 Trimestre"]),
            "description" => fake()->text(),
        ];
    }
}
