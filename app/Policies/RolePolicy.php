<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any roles.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_roles');
    }

    /**
     * Determine whether the user can view the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function view(User $user, Role $role): bool
    {
        return $user->can('view_roles');
    }

    /**
     * Determine whether the user can create roles.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->can('create_roles');
    }

    /**
     * Determine whether the user can update the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function update(User $user, Role $role): bool
    {
        // Cannot modify the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('update_roles');
    }

    /**
     * Determine whether the user can delete the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function delete(User $user, Role $role): bool
    {
        // Cannot delete the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        // Cannot delete roles that have users assigned
        if ($role->users()->count() > 0) {
            return false;
        }

        return $user->can('delete_roles');
    }

    /**
     * Determine whether the user can assign permissions to the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function assignPermissions(User $user, Role $role): bool
    {
        // Cannot modify permissions for the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('assign_permissions');
    }

    /**
     * Determine whether the user can sync permissions for the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function syncPermissions(User $user, Role $role): bool
    {
        // Cannot modify permissions for the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('assign_permissions');
    }

    /**
     * Determine whether the user can revoke permissions from the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function revokePermissions(User $user, Role $role): bool
    {
        // Cannot modify permissions for the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('assign_permissions');
    }

    /**
     * Determine whether the user can restore the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function restore(User $user, Role $role): bool
    {
        // Cannot restore the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('restore_roles');
    }

    /**
     * Determine whether the user can permanently delete the role.
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function forceDelete(User $user, Role $role): bool
    {
        // Cannot force delete the default admin role
        if ($role->name === 'admin') {
            return false;
        }

        return $user->can('force_delete_roles');
    }
}