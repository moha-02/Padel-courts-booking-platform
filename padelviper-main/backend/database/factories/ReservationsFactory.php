<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Pistas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations>
 */
class ReservationsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "pistas_id"=>Pistas::factory(),
            "user_id"=>User::factory(),
            "start_time" => '10:00',
            "end_time" => '11:30',
            "reservation_date" => fake()->date(),
        ];
    }
}
