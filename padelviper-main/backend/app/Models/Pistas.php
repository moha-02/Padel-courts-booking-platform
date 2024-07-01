<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pistas extends Model
{
    use HasFactory;

    public function reservations()
    {
        return $this->hasMany(Reservations::class);
    }
    public function club()
    {
        return $this->belongsTo(Club::class, 'clubs_id');
    }
    public function pricePistas()
    {
        return $this->hasMany(PricePista::class, 'pista_id');
    }

    protected $fillable = [
        'clubs_id',
        'nombre',
    ];
    public $timestamps = false;
}
