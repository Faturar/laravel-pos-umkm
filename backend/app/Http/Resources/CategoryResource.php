<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'outlet_id' => $this->outlet_id,
            'outlet' => $this->whenLoaded('outlet', function () {
                return [
                    'id' => $this->outlet->id,
                    'name' => $this->outlet->name,
                    'code' => $this->outlet->code,
                ];
            }),
            'products_count' => $this->when($this->products_count, $this->products_count),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}