<?php

namespace App\Http\Resources\reservations;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data.pistas_id' => $this->pistas_id,
            'data.user_id' => $this->user_id,
            'data.start_time' => $this->start_time,
            'data.end_time' => $this->end_time,
            'data.reservation_date' => $this->reservation_date,
            'data.price' => $this->price,
        ];
    }
}
