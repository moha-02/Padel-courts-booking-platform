<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Club>
 */
class ClubFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'calle' =>fake()->streetAddress(),
            'zip' => fake()->postcode(),
            'numero' => fake()->address(),
            'localidad' => fake()->city(),
            'pais' => fake()->country(),
            'img' => fake()->imageUrl(),
            'horario' => '07:00 - 21:00',
            'contact_number' => fake()->phoneNumber()
        ];
        
    }
}
