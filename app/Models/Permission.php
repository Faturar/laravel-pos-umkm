<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
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
        'group',
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
            'group' => 'string',
        ];
    }

    /**
     * Get the roles that belong to the permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_role');
    }

    /**
     * Get the users that have this permission through roles.
     */
    public function users()
    {
        return $this->hasManyThrough(
            User::class,
            Role::class,
            'permission_role.role_id',
            'role_user.user_id',
            'id',
            'id'
        );
    }

    /**
     * Scope a query to only include permissions in a specific group.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $group
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeGroup($query, $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope a query to only include permissions with specific name.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $name
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeName($query, $name)
    {
        return $query->where('name', $name);
    }

    /**
     * Get all permissions grouped by group name.
     *
     * @return array
     */
    public static function getGrouped()
    {
        $permissions = self::all()->groupBy('group');
        
        return $permissions->map(function ($group) {
            return $group->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'label' => $permission->label,
                ];
            });
        })->toArray();
    }

    /**
     * Create a new permission or return existing one.
     *
     * @param array $attributes
     * @return static
     */
    public static function firstOrCreate(array $attributes)
    {
        $permission = static::where('name', $attributes['name'])->first();
        
        if (!$permission) {
            $permission = static::create($attributes);
        }
        
        return $permission;
    }
}