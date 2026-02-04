<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComboItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'sku' => $this->product->sku,
                    'price' => (float) $this->product->price,
                    'cost' => (float) $this->product->cost,
                    'stock' => $this->product->stock,
                ];
            }),
            'variant_id' => $this->variant_id,
            'variant' => $this->whenLoaded('variant', function () {
                return $this->variant ? [
                    'id' => $this->variant->id,
                    'name' => $this->variant->name,
                    'sku' => $this->variant->sku,
                    'price' => (float) $this->variant->price,
                    'cost' => (float) $this->variant->cost,
                    'stock' => $this->variant->stock,
                ] : null;
            }),
            'qty' => $this->qty,
        ];
    }
}