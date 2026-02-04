<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => $this->category ? new CategoryResource($this->category) : null,
            'outlet_id' => $this->outlet_id,
            'outlet' => $this->outlet ? new OutletResource($this->outlet) : null,
            'price' => (float) $this->price,
            'cost' => (float) $this->cost,
            'stock' => (int) $this->stock,
            'min_stock' => (int) $this->min_stock,
            'unit' => $this->unit,
            'is_active' => (bool) $this->is_active,
            'has_variants' => (bool) $this->has_variants,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'image_url' => $this->image_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}