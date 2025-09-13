<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Matiere>
 */
class MatiereFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "libelle" => fake()->randomElement(["Math", "PCT", "Philosophie", "Anglais", "Français"]),
            "coefficient" => fake()->numberBetween("2", "3", "4", "5"),
        ];
    }
}
