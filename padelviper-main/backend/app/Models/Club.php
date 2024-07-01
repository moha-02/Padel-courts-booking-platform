<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;
    public function pistas()
    {
        return $this->hasMany(Pistas::class);
    }

    protected $fillable = [
        'name',
        'calle',
        'zip',
        'numero',
        'localidad',
        'pais',
        'img',
        'horario',
        'contact_number',
    ];
    public $timestamps = false;
}
