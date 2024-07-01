<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Club;
use App\Models\Pistas;
use App\Models\Reservations;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        //crea 6 reservas con 6 pistas con 6 clubes con 6 usuarios todos diferentes ahora se puede añadir reservas nuevas
        //usando los datos que hay o creando nuevos
        Reservations::factory()->count(1)->create();

        // Reservations::factory()->create([
        //     "pistas_id"=>1,
        //     "user_id"=>1,
        //     "start_time" => '10:00',
        //     "end_time" => '11:30',
        //     "reservation_date" => '2024-03-30',
        // ]);
    }
}
