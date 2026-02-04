<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'quantity',
        'before_quantity',
        'after_quantity',
        'notes',
        'product_id',
        'product_variant_id',
        'transaction_id',
        'user_id',
        'outlet_id',
    ];

    protected $casts = [
        'type' => 'string',
        'quantity' => 'integer',
        'before_quantity' => 'integer',
        'after_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public static function createMovement(
        $type,
        $quantity,
        $productId,
        $productVariantId = null,
        $transactionId = null,
        $userId = null,
        $outletId = null,
        $notes = null
    ) {
        $product = Product::find($productId);
        $productVariant = $productVariantId ? ProductVariant::find($productVariantId) : null;
        
        $target = $productVariant ?? $product;
        $beforeQuantity = $target->stock_quantity;
        $afterQuantity = $beforeQuantity;
        
        if ($type === 'in') {
            $afterQuantity += $quantity;
        } elseif ($type === 'out') {
            $afterQuantity -= $quantity;
        } elseif ($type === 'adjustment') {
            $afterQuantity = $quantity;
        }
        
        // Update stock
        $target->stock_quantity = $afterQuantity;
        $target->save();
        
        // Create stock movement record
        return self::create([
            'type' => $type,
            'quantity' => $quantity,
            'before_quantity' => $beforeQuantity,
            'after_quantity' => $afterQuantity,
            'notes' => $notes,
            'product_id' => $productId,
            'product_variant_id' => $productVariantId,
            'transaction_id' => $transactionId,
            'user_id' => $userId ?? (Auth::check() ? Auth::id() : null),
            'outlet_id' => $outletId,
        ]);
    }
}