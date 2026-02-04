<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionDetailResource extends JsonResource
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
            'uuid' => $this->uuid,
            'invoice_number' => $this->invoice_number,
            'customer_id' => $this->customer_id,
            'customer' => $this->customer ? new CustomerResource($this->customer) : null,
            'outlet_id' => $this->outlet_id,
            'outlet' => $this->outlet ? new OutletResource($this->outlet) : null,
            'user_id' => $this->user_id,
            'user' => $this->user ? new UserResource($this->user) : null,
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'tax_amount' => (float) $this->tax_amount,
            'service_charge_amount' => (float) $this->service_charge_amount,
            'final_amount' => (float) $this->final_amount,
            'paid_amount' => (float) $this->paid_amount,
            'change_amount' => (float) $this->change_amount,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'is_void' => (bool) $this->is_void,
            'is_refund' => (bool) $this->is_refund,
            'void_reason' => $this->void_reason,
            'refund_reason' => $this->refund_reason,
            'notes' => $this->notes,
            'is_synced' => (bool) $this->is_synced,
            'items' => TransactionItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}