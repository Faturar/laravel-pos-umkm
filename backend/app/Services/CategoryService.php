<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Outlet;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CategoryService
{
    /**
     * Get all categories with optional filters
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories($filters = [])
    {
        $query = Category::query();
        
        // Filter by outlet if provided
        if (isset($filters['outlet_id'])) {
            $query->where('outlet_id', $filters['outlet_id']);
        } else {
            // If no outlet specified, get global categories (without outlet)
            $query->whereNull('outlet_id');
        }
        
        // Filter by active status if provided
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }
        
        // Search by name if provided
        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        
        // Include product count if requested
        if (isset($filters['with_product_count']) && $filters['with_product_count']) {
            $query->withCount('products');
        }
        
        // Order by name by default
        $query->orderBy('name');
        
        return $query->get();
    }
    
    /**
     * Get a specific category by ID
     *
     * @param int $id
     * @return Category
     */
    public function getCategoryById($id)
    {
        return Category::findOrFail($id);
    }
    
    /**
     * Create a new category
     *
     * @param array $data
     * @return Category
     */
    public function createCategory($data)
    {
        return DB::transaction(function () use ($data) {
            $category = Category::create($data);
            
            return $category;
        });
    }
    
    /**
     * Update a category
     *
     * @param int $id
     * @param array $data
     * @return Category
     */
    public function updateCategory($id, $data)
    {
        $category = Category::findOrFail($id);
        
        return DB::transaction(function () use ($category, $data) {
            $category->update($data);
            
            return $category;
        });
    }
    
    /**
     * Delete a category
     *
     * @param int $id
     * @return bool
     */
    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        
        return DB::transaction(function () use ($category) {
            // Check if category has products
            if ($category->products()->count() > 0) {
                throw new \Exception('Cannot delete category with associated products');
            }
            
            $category->delete();
            
            return true;
        });
    }
    
    /**
     * Toggle category active status
     *
     * @param int $id
     * @return Category
     */
    public function toggleCategoryStatus($id)
    {
        $category = Category::findOrFail($id);
        
        return DB::transaction(function () use ($category) {
            $category->is_active = !$category->is_active;
            $category->save();
            
            return $category;
        });
    }
    
    /**
     * Get categories for dropdown/select options
     *
     * @param int|null $outletId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCategoriesForDropdown($outletId = null)
    {
        $query = Category::where('is_active', true);
        
        if ($outletId) {
            $query->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        } else {
            $query->whereNull('outlet_id');
        }
        
        return $query->orderBy('name')->get(['id', 'name']);
    }
}