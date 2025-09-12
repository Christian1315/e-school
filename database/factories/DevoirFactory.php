<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Devoir>
 */
class DevoirFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // "school_id"=>fake()->numberBetween(1,10),
            // "apprenant_id"=>fake()->numberBetween(1,10),
            // "trimestre_id"=>fake()->numberBetween(1,10),
            // "matiere_id"=>fake()->numberBetween(1,10),
            "note"=>fake()->numberBetween(1,20),
            // "created_by"=>fake()->numberBetween(1,10),
            // "updated_by"=>fake()->numberBetween(1,10)
        ];
    }
}
