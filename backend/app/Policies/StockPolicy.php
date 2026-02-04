<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class StockPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any stock.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_stock');
    }

    /**
     * Determine whether the user can view the product stock.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Product $product)
    {
        // Admin/owner can view all stock
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view stock in their outlet
        return $user->outlet_id === $product->outlet_id;
    }

    /**
     * Determine whether the user can create stock movements.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermission('manage_stock');
    }

    /**
     * Determine whether the user can update the product stock.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Product $product)
    {
        // Admin/owner can update all stock
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('manage_stock');
        }
        
        // Regular users can only update stock in their outlet
        return $user->outlet_id === $product->outlet_id && 
               $user->hasPermission('manage_stock');
    }
}