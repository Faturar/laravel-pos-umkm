<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
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
            'user_id' => $this->user_id,
            'user_name' => $this->user ? $this->user->name : null,
            'action' => $this->action,
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'description' => $this->description,
            'data' => is_string($this->data) ? json_decode($this->data, true) : $this->data,
            'outlet_id' => $this->outlet_id,
            'outlet_name' => $this->outlet ? $this->outlet->name : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}