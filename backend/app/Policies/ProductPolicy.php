<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any products.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_products');
    }

    /**
     * Determine whether the user can view the product.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Product $product)
    {
        // Admin/owner can view all products
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view products in their outlet
        return $user->outlet_id === $product->outlet_id;
    }

    /**
     * Determine whether the user can create products.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermission('create_products');
    }

    /**
     * Determine whether the user can update the product.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Product $product)
    {
        // Admin/owner can update all products
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('edit_products');
        }
        
        // Regular users can only update products in their outlet
        return $user->outlet_id === $product->outlet_id && 
               $user->hasPermission('edit_products');
    }

    /**
     * Determine whether the user can delete the product.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Product $product)
    {
        // Admin/owner can delete all products
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('delete_products');
        }
        
        // Regular users can only delete products in their outlet
        return $user->outlet_id === $product->outlet_id && 
               $user->hasPermission('delete_products');
    }
}