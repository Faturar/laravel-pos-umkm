<?php

namespace App\Services;

use App\Models\ProductVariant;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class ProductVariantService
{
    /**
     * Create a new product variant
     *
     * @param array $data
     * @return ProductVariant
     */
    public function createProductVariant($data)
    {
        return DB::transaction(function () use ($data) {
            $variant = ProductVariant::create($data);
            
            // Log the creation
            activity()
                ->useLog('product_variant')
                ->performedOn($variant)
                ->withProperties(['action' => 'create', 'data' => $data])
                ->log('Product variant created: ' . $variant->name);
            
            return $variant;
        });
    }
    
    /**
     * Update a product variant
     *
     * @param int $id
     * @param array $data
     * @return ProductVariant
     */
    public function updateProductVariant($id, $data)
    {
        $variant = ProductVariant::findOrFail($id);
        
        return DB::transaction(function () use ($variant, $data) {
            $oldValues = $variant->getOriginal();
            
            $variant->update($data);
            
            // Log the update
            activity()
                ->useLog('product_variant')
                ->performedOn($variant)
                ->withProperties([
                    'action' => 'update',
                    'old' => $oldValues,
                    'new' => $data
                ])
                ->log('Product variant updated: ' . $variant->name);
            
            return $variant;
        });
    }
    
    /**
     * Delete a product variant
     *
     * @param int $id
     * @return bool
     */
    public function deleteProductVariant($id)
    {
        $variant = ProductVariant::findOrFail($id);
        
        return DB::transaction(function () use ($variant) {
            // Check if variant has transactions
            if ($variant->transactionItems()->count() > 0) {
                throw new \Exception('Cannot delete product variant with associated transactions');
            }
            
            $variantName = $variant->name;
            $variant->delete();
            
            // Log the deletion
            activity()
                ->useLog('product_variant')
                ->withProperties(['action' => 'delete', 'variant_name' => $variantName])
                ->log('Product variant deleted: ' . $variantName);
            
            return true;
        });
    }
    
    /**
     * Update product variant stock
     *
     * @param int $id
     * @param int $quantity
     * @param string|null $notes
     * @return ProductVariant
     */
    public function updateProductVariantStock($id, $quantity, $notes = null)
    {
        $variant = ProductVariant::findOrFail($id);
        
        return DB::transaction(function () use ($variant, $quantity, $notes) {
            $beforeQuantity = $variant->stock_quantity;
            $type = $quantity > $beforeQuantity ? 'in' : 'out';
            $stockQuantity = abs($quantity - $beforeQuantity);
            
            // Create stock movement record
            StockMovement::createMovement(
                $type,
                $stockQuantity,
                $variant->product_id,
                $variant->id, // product variant id
                null, // transaction id
                auth()->id(),
                null, // outlet id (will be inherited from product)
                $notes
            );
            
            // Log the stock update
            activity()
                ->useLog('product_variant')
                ->performedOn($variant)
                ->withProperties([
                    'action' => 'stock_update',
                    'before' => $beforeQuantity,
                    'after' => $quantity,
                    'notes' => $notes
                ])
                ->log('Product variant stock updated: ' . $variant->name);
            
            return $variant->fresh();
        });
    }
    
    /**
     * Get product variants for a product
     *
     * @param int $productId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProductVariantsByProduct($productId)
    {
        return ProductVariant::where('product_id', $productId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
    
    /**
     * Get low stock product variants
     *
     * @param int|null $productId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLowStockVariants($productId = null)
    {
        $query = ProductVariant::whereRaw('stock_quantity <= stock_alert_threshold');
        
        if ($productId) {
            $query->where('product_id', $productId);
        }
        
        return $query->with('product')
                   ->orderBy('name')
                   ->get();
    }
    
    /**
     * Get out of stock product variants
     *
     * @param int|null $productId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getOutOfStockVariants($productId = null)
    {
        $query = ProductVariant::where('stock_quantity', '<=', 0);
        
        if ($productId) {
            $query->where('product_id', $productId);
        }
        
        return $query->with('product')
                   ->orderBy('name')
                   ->get();
    }
}