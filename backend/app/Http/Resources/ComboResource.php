<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComboResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'is_active' => (bool) $this->is_active,
            'outlet_id' => $this->outlet_id,
            'outlet' => $this->whenLoaded('outlet', function () {
                return $this->outlet ? [
                    'id' => $this->outlet->id,
                    'name' => $this->outlet->name,
                ] : null;
            }),
            'items' => ComboItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}