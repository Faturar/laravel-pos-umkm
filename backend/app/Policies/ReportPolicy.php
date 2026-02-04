<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_reports');
    }

    /**
     * Determine whether the user can view sales reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewSales(User $user)
    {
        return $user->hasPermission('view_reports');
    }

    /**
     * Determine whether the user can view product reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewProducts(User $user)
    {
        return $user->hasPermission('view_reports');
    }

    /**
     * Determine whether the user can view payment reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewPayments(User $user)
    {
        return $user->hasPermission('view_reports');
    }

    /**
     * Determine whether the user can view cash reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewCash(User $user)
    {
        return $user->hasPermission('view_reports');
    }

    /**
     * Determine whether the user can view inventory reports.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewInventory(User $user)
    {
        return $user->hasPermission('view_reports');
    }
}