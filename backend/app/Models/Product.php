<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'cost',
        'sku',
        'barcode',
        'image',
        'is_active',
        'track_stock',
        'stock_quantity',
        'stock_alert_threshold',
        'category_id',
        'outlet_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'is_active' => 'boolean',
        'track_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'stock_alert_threshold' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
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
        return $this->track_stock && $this->stock_quantity <= $this->stock_alert_threshold;
    }

    public function isOutOfStock()
    {
        return $this->track_stock && $this->stock_quantity <= 0;
    }
}