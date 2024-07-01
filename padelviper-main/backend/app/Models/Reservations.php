<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservations extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsToMany(User::class, Pistas::class);
    }

    public function pista()
    {
        return $this->belongsTo(Pistas::class, 'pistas_id');
    }

    protected $fillable = [
        "pistas_id",
        "user_id",
        "start_time",
        "end_time",
        "reservation_date",
        "price"

    ];
}
