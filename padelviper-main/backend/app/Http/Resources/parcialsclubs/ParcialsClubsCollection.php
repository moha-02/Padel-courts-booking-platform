<?php

namespace App\Http\Resources\parcialsclubs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ParcialsClubsCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection;
    }
}
