<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'combo_id',
        'product_id',
        'variant_id',
        'qty',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];

    /**
     * Get the combo that owns the item.
     */
    public function combo()
    {
        return $this->belongsTo(Combo::class);
    }

    /**
     * Get the product that belongs to the combo item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant that belongs to the combo item.
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}