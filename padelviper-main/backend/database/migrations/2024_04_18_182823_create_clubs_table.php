<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('calle');
            $table->string('zip');
            $table->string('numero');//sitring si el numero tiene letra 
            $table->string('localidad');
            $table->string('pais');
            $table->string('img');
            $table->string('horario');
            $table->string('contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};
