<?php

namespace App\Http\Resources\clubs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClubsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'direction' => $this->calle.' '.$this->numero.', '.$this->zip ,
            'image' => $this->img,
        ];
    }
}
