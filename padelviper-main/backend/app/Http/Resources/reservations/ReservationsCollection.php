<?php

namespace App\Http\Resources\reservations;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ReservationsCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'links' => [
                'self' => route('reservations.index'),
            ],
        ];
    }
}
