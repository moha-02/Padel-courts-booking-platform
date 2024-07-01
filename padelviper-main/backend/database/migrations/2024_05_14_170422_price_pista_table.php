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
        Schema::create('pricepista', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pista_id')->constrained('pistas')->cascadeOnDelete();
            $table->decimal('prange1', 8, 2);
            $table->decimal('prange2', 8, 2); 
            $table->decimal('prange3', 8, 2); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_pistas');
    }
};
