<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItemDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_item_id',
        'product_id',
        'variant_id',
        'qty',
        'cost',
    ];

    protected $casts = [
        'qty' => 'integer',
        'cost' => 'decimal:2',
    ];

    /**
     * Get the transaction item that owns the detail.
     */
    public function transactionItem()
    {
        return $this->belongsTo(TransactionItem::class);
    }

    /**
     * Get the product that belongs to the transaction item detail.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant that belongs to the transaction item detail.
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}