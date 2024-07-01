<?php

namespace App\Http\Resources\userstats;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'birth'=> $this->birth,
            'weight'=> $this->weight,
            'height'=> $this->height,
            'playTime'=> $this->playTime,
            'hand'=> $this->hand,
            'gameType'=> $this->gameType,
            'racketBrand'=> $this->racketBrand,
            'user_id'=> $this->user_id
        ];
    }
}
