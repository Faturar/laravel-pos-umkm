<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at ? $this->last_login_at->toISOString() : null,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'roles' => $this->when($this->relationLoaded('roles'), function () {
                return $this->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'label' => $role->label,
                        'description' => $role->description,
                    ];
                });
            }),
            'permissions' => $this->when($this->relationLoaded('roles') && $this->roles->first()?->relationLoaded('permissions'), function () {
                $permissions = [];
                foreach ($this->roles as $role) {
                    foreach ($role->permissions as $permission) {
                        if (!in_array($permission->name, $permissions)) {
                            $permissions[] = $permission->name;
                        }
                    }
                }
                return $permissions;
            }, $this->when($this->relationLoaded('roles'), function () {
                return $this->getAllPermissions();
            })),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function with($request): array
    {
        return [
            'success' => true,
            'message' => 'User data retrieved successfully',
        ];
    }
}