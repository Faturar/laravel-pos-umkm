<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Auth\Access\HandlesAuthorization;

class SettingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any settings.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_settings');
    }

    /**
     * Determine whether the user can view the setting.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Setting $setting)
    {
        // Admin/owner can view all settings
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view settings in their outlet
        return $user->outlet_id === $setting->outlet_id;
    }

    /**
     * Determine whether the user can create settings.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        // Admin/owner can create global settings
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('manage_settings');
        }
        
        // Regular users cannot create settings
        return false;
    }

    /**
     * Determine whether the user can update the setting.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Setting $setting)
    {
        // Admin/owner can update all settings
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('manage_settings');
        }
        
        // Regular users can only update settings in their outlet
        return $user->outlet_id === $setting->outlet_id && 
               $user->hasPermission('manage_settings');
    }

    /**
     * Determine whether the user can delete the setting.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Setting $setting)
    {
        // Only admin/owner can delete settings
        return $user->hasRole(['admin', 'owner']) && 
               $user->hasPermission('manage_settings');
    }
}