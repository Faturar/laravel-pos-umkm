<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProductService
{
    /**
     * Get all products with optional filters
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProducts($filters = [])
    {
        $query = Product::query();
        
        // Filter by outlet if provided
        if (isset($filters['outlet_id'])) {
            $query->where('outlet_id', $filters['outlet_id']);
        } else {
            // If no outlet specified, get global products (without outlet)
            $query->whereNull('outlet_id');
        }
        
        // Filter by category if provided
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        
        // Filter by active status if provided
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }
        
        // Filter by low stock if requested
        if (isset($filters['low_stock']) && $filters['low_stock']) {
            $query->where('track_stock', true)
                  ->whereRaw('stock_quantity <= stock_alert_threshold');
        }
        
        // Filter by out of stock if requested
        if (isset($filters['out_of_stock']) && $filters['out_of_stock']) {
            $query->where('track_stock', true)
                  ->where('stock_quantity', '<=', 0);
        }
        
        // Search by name, sku, or barcode if provided
        if (isset($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('sku', 'like', $searchTerm)
                  ->orWhere('barcode', 'like', $searchTerm);
            });
        }
        
        // Include relationships if requested
        if (isset($filters['with_category']) && $filters['with_category']) {
            $query->with('category');
        }
        
        if (isset($filters['with_variants']) && $filters['with_variants']) {
            $query->with('variants');
        }
        
        // Order by name by default
        $query->orderBy('name');
        
        return $query->get();
    }
    
    /**
     * Get a specific product by ID
     *
     * @param int $id
     * @return Product
     */
    public function getProductById($id)
    {
        return Product::with(['category', 'variants'])->findOrFail($id);
    }
    
    /**
     * Create a new product
     *
     * @param array $data
     * @return Product
     */
    public function createProduct($data)
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create($data);
            
            // Log the creation
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'model_type' => 'App\Models\Product',
                'model_id' => $product->id,
                'description' => "Product created: {$product->name}",
                'data' => json_encode($data),
                'outlet_id' => $product->outlet_id,
            ]);
            
            return $product;
        });
    }
    
    /**
     * Update a product
     *
     * @param int $id
     * @param array $data
     * @return Product
     */
    public function updateProduct($id, $data)
    {
        $product = Product::findOrFail($id);
        
        return DB::transaction(function () use ($product, $data) {
            $oldValues = $product->getOriginal();
            
            $product->update($data);
            
            // Log the update
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'model_type' => 'App\Models\Product',
                'model_id' => $product->id,
                'description' => "Product updated: {$product->name}",
                'data' => json_encode([
                    'old' => $oldValues,
                    'new' => $data
                ]),
                'outlet_id' => $product->outlet_id,
            ]);
            
            return $product;
        });
    }
    
    /**
     * Delete a product
     *
     * @param int $id
     * @return bool
     */
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        
        return DB::transaction(function () use ($product) {
            // Check if product has transactions
            if ($product->transactionItems()->count() > 0) {
                throw new \Exception('Cannot delete product with associated transactions');
            }
            
            $productName = $product->name;
            $product->delete();
            
            // Log the deletion
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'model_type' => 'App\Models\Product',
                'model_id' => $product->id,
                'description' => "Product deleted: {$productName}",
                'data' => json_encode([
                    'product_name' => $productName,
                ]),
                'outlet_id' => $product->outlet_id,
            ]);
            
            return true;
        });
    }
    
    /**
     * Update product stock
     *
     * @param int $id
     * @param int $quantity
     * @param string|null $notes
     * @return Product
     */
    public function updateProductStock($id, $quantity, $notes = null)
    {
        $product = Product::findOrFail($id);
        
        return DB::transaction(function () use ($product, $quantity, $notes) {
            $beforeQuantity = $product->stock_quantity;
            $type = $quantity > $beforeQuantity ? 'in' : 'out';
            $stockQuantity = abs($quantity - $beforeQuantity);
            
            // Create stock movement record
            StockMovement::createMovement(
                $type,
                $stockQuantity,
                $product->id,
                null, // product variant id
                null, // transaction id
                Auth::id(),
                $product->outlet_id,
                $notes
            );
            
            // Log the stock update
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'stock_update',
                'model_type' => 'App\Models\Product',
                'model_id' => $product->id,
                'description' => "Product stock updated: {$product->name}",
                'data' => json_encode([
                    'type' => $type,
                    'stock_quantity' => $stockQuantity,
                ]),
                'outlet_id' => $product->outlet_id,
            ]);
            
            return $product->fresh();
        });
    }
    
    /**
     * Search products by name, SKU, or barcode
     *
     * @param string $query
     * @param int|null $categoryId
     * @param int|null $outletId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchProducts($query, $categoryId = null, $outletId = null)
    {
        $searchTerm = '%' . $query . '%';
        
        $products = Product::where('is_active', true)
            ->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('sku', 'like', $searchTerm)
                  ->orWhere('barcode', 'like', $searchTerm);
            });
        
        if ($categoryId) {
            $products->where('category_id', $categoryId);
        }
        
        if ($outletId) {
            $products->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        }
        
        return $products->with('category')
                       ->orderBy('name')
                       ->get();
    }
    
    /**
     * Get products for dropdown/select options
     *
     * @param int|null $categoryId
     * @param int|null $outletId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProductsForDropdown($categoryId = null, $outletId = null)
    {
        $query = Product::where('is_active', true);
        
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
        
        if ($outletId) {
            $query->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        } else {
            $query->whereNull('outlet_id');
        }
        
        return $query->orderBy('name')->get(['id', 'name', 'price', 'sku', 'barcode']);
    }
    
    /**
     * Get low stock products
     *
     * @param int|null $outletId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLowStockProducts($outletId = null)
    {
        $query = Product::where('track_stock', true)
            ->whereRaw('stock_quantity <= stock_alert_threshold');
        
        if ($outletId) {
            $query->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        } else {
            $query->whereNull('outlet_id');
        }
        
        return $query->with('category')
                   ->orderBy('name')
                   ->get();
    }
    
    /**
     * Get out of stock products
     *
     * @param int|null $outletId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getOutOfStockProducts($outletId = null)
    {
        $query = Product::where('track_stock', true)
            ->where('stock_quantity', '<=', 0);
        
        if ($outletId) {
            $query->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        } else {
            $query->whereNull('outlet_id');
        }
        
        return $query->with('category')
                   ->orderBy('name')
                   ->get();
    }
}