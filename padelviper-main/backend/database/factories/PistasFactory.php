<?php

namespace Database\Factories;
use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pistas>
 */
class PistasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'clubs_id'=>Club::factory(),
            'nombre' => fake()->name
        ];
    }
}
