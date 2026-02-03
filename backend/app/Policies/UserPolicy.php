<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any users.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_users');
    }

    /**
     * Determine whether the user can view the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function view(User $user, User $targetUser): bool
    {
        // Users can view their own profile
        if ($user->id === $targetUser->id) {
            return true;
        }

        return $user->can('view_users');
    }

    /**
     * Determine whether the user can create users.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->can('create_users');
    }

    /**
     * Determine whether the user can update the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function update(User $user, User $targetUser): bool
    {
        // Users can update their own profile
        if ($user->id === $targetUser->id) {
            return true;
        }

        return $user->can('update_users');
    }

    /**
     * Determine whether the user can update the user status.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function updateStatus(User $user, User $targetUser): bool
    {
        // Users cannot change their own status
        if ($user->id === $targetUser->id) {
            return false;
        }

        return $user->can('manage_users');
    }

    /**
     * Determine whether the user can delete the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function delete(User $user, User $targetUser): bool
    {
        // Users cannot delete themselves
        if ($user->id === $targetUser->id) {
            return false;
        }

        return $user->can('delete_users');
    }

    /**
     * Determine whether the user can assign roles to the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function assignRoles(User $user, User $targetUser): bool
    {
        // Users cannot assign roles to themselves
        if ($user->id === $targetUser->id) {
            return false;
        }

        return $user->can('assign_roles');
    }

    /**
     * Determine whether the user can restore the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function restore(User $user, User $targetUser): bool
    {
        // Users cannot restore themselves
        if ($user->id === $targetUser->id) {
            return false;
        }

        return $user->can('restore_users');
    }

    /**
     * Determine whether the user can permanently delete the user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function forceDelete(User $user, User $targetUser): bool
    {
        // Users cannot force delete themselves
        if ($user->id === $targetUser->id) {
            return false;
        }

        return $user->can('force_delete_users');
    }
}