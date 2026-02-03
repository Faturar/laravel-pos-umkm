<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'label',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'label' => 'string',
            'description' => 'string',
        ];
    }

    /**
     * Get the users that belong to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user');
    }

    /**
     * Get the permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    /**
     * Check if role has a specific permission.
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermission($permission)
    {
        return $this->permissions()->where('name', $permission)->exists();
    }

    /**
     * Assign permission to role.
     *
     * @param mixed $permission
     * @return void
     */
    public function givePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        if (is_array($permission)) {
            $permission = Permission::whereIn('name', $permission)->get();
        }

        $this->permissions()->syncWithoutDetaching($permission);
    }

    /**
     * Remove permission from role.
     *
     * @param mixed $permission
     * @return void
     */
    public function revokePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        if (is_array($permission)) {
            $permission = Permission::whereIn('name', $permission)->get();
        }

        $this->permissions()->detach($permission);
    }

    /**
     * Sync permissions for role.
     *
     * @param mixed $permissions
     * @return void
     */
    public function syncPermissions($permissions)
    {
        if (is_string($permissions)) {
            $permissions = [$permissions];
        }

        if (is_array($permissions)) {
            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
            $this->permissions()->sync($permissionIds);
        } else {
            $this->permissions()->sync($permissions);
        }
    }

    /**
     * Scope a query to only include roles with specific name.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $name
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeName($query, $name)
    {
        return $query->where('name', $name);
    }
}