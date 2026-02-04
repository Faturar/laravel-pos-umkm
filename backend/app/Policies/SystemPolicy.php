<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SystemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can perform system health checks.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function healthCheck(User $user)
    {
        // All authenticated users can check system health
        return true;
    }

    /**
     * Determine whether the user can create backups.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function createBackup(User $user)
    {
        // Only admin/owner can create backups
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('manage_system');
    }

    /**
     * Determine whether the user can view backup history.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewBackupHistory(User $user)
    {
        // Only admin/owner can view backup history
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('manage_system');
    }

    /**
     * Determine whether the user can download backups.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function downloadBackup(User $user)
    {
        // Only admin/owner can download backups
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('manage_system');
    }
}