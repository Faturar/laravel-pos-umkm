<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Category;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any categories.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_categories');
    }

    /**
     * Determine whether the user can view the category.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Category $category)
    {
        // Admin/owner can view all categories
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view categories in their outlet
        return $user->outlet_id === $category->outlet_id;
    }

    /**
     * Determine whether the user can create categories.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermission('create_categories');
    }

    /**
     * Determine whether the user can update the category.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Category $category)
    {
        // Admin/owner can update all categories
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('edit_categories');
        }
        
        // Regular users can only update categories in their outlet
        return $user->outlet_id === $category->outlet_id && 
               $user->hasPermission('edit_categories');
    }

    /**
     * Determine whether the user can delete the category.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Category $category)
    {
        // Admin/owner can delete all categories
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('delete_categories');
        }
        
        // Regular users can only delete categories in their outlet
        return $user->outlet_id === $category->outlet_id && 
               $user->hasPermission('delete_categories');
    }
}