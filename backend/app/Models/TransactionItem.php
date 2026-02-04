<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'price',
        'cost',
        'quantity',
        'discount_amount',
        'tax_amount',
        'subtotal',
        'total_price',
        'notes',
        'transaction_id',
        'product_id',
        'product_variant_id',
        'combo_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'quantity' => 'integer',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
    
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function combo()
    {
        return $this->belongsTo(Combo::class);
    }

    public function details()
    {
        return $this->hasMany(TransactionItemDetail::class);
    }

    /**
     * Check if this transaction item is a combo.
     */
    public function isCombo()
    {
        return $this->type === 'combo';
    }

    /**
     * Check if this transaction item is a regular product.
     */
    public function isProduct()
    {
        return $this->type === 'product';
    }
}