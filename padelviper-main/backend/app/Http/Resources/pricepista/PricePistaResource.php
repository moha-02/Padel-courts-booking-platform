<?php

namespace App\Http\Resources\pricepista;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricePistaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'pista_id' => $this->pista_id,
            'prange1' => $this->prange1,
            'prange2' => $this->prange2,
            'prange3' => $this->prange3,
        ];
    }
}
