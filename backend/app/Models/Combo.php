<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Combo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'price',
        'is_active',
        'outlet_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the outlet that owns the combo.
     */
    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Get the items that belong to the combo.
     */
    public function items()
    {
        return $this->hasMany(ComboItem::class);
    }

    /**
     * Get the transaction items for this combo.
     */
    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }

    /**
     * Scope a query to only include active combos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include combos for a specific outlet.
     */
    public function scopeForOutlet($query, $outletId)
    {
        return $query->where('outlet_id', $outletId);
    }

    /**
     * Check if the combo has enough stock for the given quantity.
     */
    public function hasEnoughStock($quantity = 1)
    {
        foreach ($this->items as $item) {
            $product = $item->product;
            
            // If item has a variant, check variant stock
            if ($item->variant_id) {
                $variant = $item->variant;
                if (!$variant || $variant->stock < ($item->qty * $quantity)) {
                    return false;
                }
            } else {
                // Check product stock
                if ($product->stock < ($item->qty * $quantity)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Get the maximum quantity that can be sold based on stock.
     */
    public function getMaxQuantity()
    {
        $maxQuantity = PHP_INT_MAX;
        
        foreach ($this->items as $item) {
            $product = $item->product;
            
            if ($item->variant_id) {
                $variant = $item->variant;
                if ($variant) {
                    $itemMaxQuantity = floor($variant->stock / $item->qty);
                    $maxQuantity = min($maxQuantity, $itemMaxQuantity);
                } else {
                    return 0; // Variant not found
                }
            } else {
                $itemMaxQuantity = floor($product->stock / $item->qty);
                $maxQuantity = min($maxQuantity, $itemMaxQuantity);
            }
        }
        
        return $maxQuantity > 0 ? $maxQuantity : 0;
    }
}