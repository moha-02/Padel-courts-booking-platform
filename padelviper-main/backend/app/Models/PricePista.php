<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricePista extends Model
{
    use HasFactory;

    protected $table = 'pricepista';

    public function pista()
    {
        return $this->belongsTo(Pistas::class, 'pista_id');
    }
    protected $fillable = [
        'pista_id',
        'price',
        "prange1",
        "prange2",
        "prange3"
    ];

    public $timestamps = false;
}
