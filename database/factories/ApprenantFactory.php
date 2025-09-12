<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Apprenant>
 */
class ApprenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // "parent_id" => fake()->numberBetween(1, 10),
            // "school_id" => fake()->numberBetween(1, 10),
            // "classe_id" => fake()->numberBetween(1, 10),
            "firstname" => fake()->firstName(),
            "lastname" => fake()->lastName(),
            "adresse" => fake()->address(),
            "email" => fake()->unique()->safeEmail(),
            "phone" => fake()->phoneNumber(),
            "date_naissance" => fake()->date(),
            "lieu_naissance" => fake()->city(),
            "sexe" => fake()->randomElement(["maxculin", "feminin"]),
            "photo" => fake()->imageUrl(640, 480, 'people'),
            // "created_by" => fake()->numberBetween(1, 10),
            // "updated_by" => fake()->numberBetween(1, 10),
        ];
    }
}
