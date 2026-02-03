<?php

namespace App\Support\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

class PermissionChecker
{
    /**
     * Check if user has a specific permission.
     *
     * @param User $user
     * @param string $permission
     * @return bool
     */
    public function hasPermission(User $user, string $permission): bool
    {
        return $user->can($permission);
    }

    /**
     * Check if user has all specified permissions.
     *
     * @param User $user
     * @param array $permissions
     * @return bool
     */
    public function hasAllPermissions(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$user->can($permission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if user has any of the specified permissions.
     *
     * @param User $user
     * @param array $permissions
     * @return bool
     */
    public function hasAnyPermission(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($user->can($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has a specific role.
     *
     * @param User $user
     * @param string $role
     * @return bool
     */
    public function hasRole(User $user, string $role): bool
    {
        return $user->hasRole($role);
    }

    /**
     * Check if user has all specified roles.
     *
     * @param User $user
     * @param array $roles
     * @return bool
     */
    public function hasAllRoles(User $user, array $roles): bool
    {
        foreach ($roles as $role) {
            if (!$user->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if user has any of the specified roles.
     *
     * @param User $user
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(User $user, array $roles): bool
    {
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get all user permissions.
     *
     * @param User $user
     * @return array
     */
    public function getAllPermissions(User $user): array
    {
        return $user->getAllPermissions();
    }

    /**
     * Get all user roles.
     *
     * @param User $user
     * @return array
     */
    public function getAllRoles(User $user): array
    {
        return $user->getAllRoles();
    }

    /**
     * Get user permissions grouped by resource.
     *
     * @param User $user
     * @return array
     */
    public function getPermissionsByResource(User $user): array
    {
        $permissions = $user->getAllPermissions();
        $grouped = [];

        foreach ($permissions as $permission) {
            // Split permission name into action and resource
            $parts = explode('_', $permission);
            if (count($parts) >= 2) {
                $action = $parts[0];
                $resource = implode('_', array_slice($parts, 1));
                
                if (!isset($grouped[$resource])) {
                    $grouped[$resource] = [];
                }
                
                $grouped[$resource][] = $action;
            }
        }

        return $grouped;
    }

    /**
     * Get cached user permissions.
     *
     * @param User $user
     * @param int $ttl
     * @return array
     */
    public function getCachedPermissions(User $user, int $ttl = 3600): array
    {
        $cacheKey = 'user_permissions_' . $user->id;
        
        return Cache::remember($cacheKey, $ttl, function () use ($user) {
            return $user->getAllPermissions();
        });
    }

    /**
     * Clear user permission cache.
     *
     * @param User $user
     * @return void
     */
    public function clearPermissionCache(User $user): void
    {
        $cacheKey = 'user_permissions_' . $user->id;
        Cache::forget($cacheKey);
    }

    /**
     * Check if user is active.
     *
     * @param User $user
     * @return bool
     */
    public function isUserActive(User $user): bool
    {
        return $user->status === 'active';
    }

    /**
     * Check if user is suspended.
     *
     * @param User $user
     * @return bool
     */
    public function isUserSuspended(User $user): bool
    {
        return $user->status === 'suspended';
    }

    /**
     * Check if user can access a specific route based on required permissions.
     *
     * @param User $user
     * @param array $requiredPermissions
     * @param string $type 'any' or 'all'
     * @return bool
     */
    public function canAccessRoute(User $user, array $requiredPermissions, string $type = 'any'): bool
    {
        if (empty($requiredPermissions)) {
            return true;
        }

        if ($type === 'all') {
            return $this->hasAllPermissions($user, $requiredPermissions);
        }

        return $this->hasAnyPermission($user, $requiredPermissions);
    }

    /**
     * Check if user is the owner of a resource.
     *
     * @param User $user
     * @param mixed $resource
     * @param string $resourceUserIdField
     * @return bool
     */
    public function isOwner(User $user, $resource, string $resourceUserIdField = 'user_id'): bool
    {
        if (!is_object($resource) || !isset($resource->{$resourceUserIdField})) {
            return false;
        }

        return (int) $user->id === (int) $resource->{$resourceUserIdField};
    }

    /**
     * Check if user can manage a resource (owner or has permission).
     *
     * @param User $user
     * @param mixed $resource
     * @param string $permission
     * @param string $resourceUserIdField
     * @return bool
     */
    public function canManage(User $user, $resource, string $permission, string $resourceUserIdField = 'user_id'): bool
    {
        return $this->isOwner($user, $resource, $resourceUserIdField) || 
               $this->hasPermission($user, $permission);
    }
}