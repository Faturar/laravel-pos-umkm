<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Outlet;
use Illuminate\Auth\Access\HandlesAuthorization;

class OutletPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any outlets.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_outlets');
    }

    /**
     * Determine whether the user can view the outlet.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Outlet  $outlet
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Outlet $outlet)
    {
        // Admin/owner can view all outlets
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view their own outlet
        return $user->outlet_id === $outlet->id;
    }

    /**
     * Determine whether the user can create outlets.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        // Only admin/owner can create outlets
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('create_outlets');
    }

    /**
     * Determine whether the user can update the outlet.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Outlet  $outlet
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Outlet $outlet)
    {
        // Only admin/owner can update outlets
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('edit_outlets');
    }

    /**
     * Determine whether the user can delete the outlet.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Outlet  $outlet
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Outlet $outlet)
    {
        // Only admin/owner can delete outlets
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('delete_outlets');
    }

    /**
     * Determine whether the user can switch outlets.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function switch(User $user)
    {
        return $user->hasPermission('switch_outlets');
    }
}