<?php

namespace App\Http\Resources\pistas;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PistasResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "nombre"=>$this->nombre,
            "clubs_id"=>$this->clubs_id
        ];
    }
}
