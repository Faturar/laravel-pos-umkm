<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'cost',
        'sku',
        'barcode',
        'is_active',
        'stock_quantity',
        'stock_alert_threshold',
        'product_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'is_active' => 'boolean',
        'stock_quantity' => 'integer',
        'stock_alert_threshold' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function isLowStock()
    {
        return $this->stock_quantity <= $this->stock_alert_threshold;
    }

    public function isOutOfStock()
    {
        return $this->stock_quantity <= 0;
    }
}