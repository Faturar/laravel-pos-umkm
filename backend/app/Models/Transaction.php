<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'invoice_number',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'service_charge_amount',
        'total_amount',
        'final_amount',
        'paid_amount',
        'change_amount',
        'payment_method',
        'payment_reference',
        'notes',
        'status',
        'is_void',
        'is_refund',
        'void_reason',
        'refund_reason',
        'is_synced',
        'cashier_id',
        'customer_id',
        'outlet_id',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'service_charge_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'is_void' => 'boolean',
        'is_refund' => 'boolean',
        'is_synced' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (empty($transaction->invoice_number)) {
                $transaction->invoice_number = self::generateInvoiceNumber();
            }
        });
    }

    public static function generateInvoiceNumber()
    {
        $prefix = 'INV-' . date('Ymd');
        $lastTransaction = self::where('invoice_number', 'like', $prefix . '%')
            ->orderBy('invoice_number', 'desc')
            ->first();

        if ($lastTransaction) {
            $lastNumber = intval(substr($lastTransaction->invoice_number, -4));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeVoided($query)
    {
        return $query->where('status', 'voided');
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('created_at', $date);
    }

    public function scopeByCashier($query, $cashierId)
    {
        return $query->where('cashier_id', $cashierId);
    }

    public function scopeByPaymentMethod($query, $paymentMethod)
    {
        return $query->where('payment_method', $paymentMethod);
    }

    public function scopeByOutlet($query, $outletId)
    {
        return $query->where('outlet_id', $outletId);
    }

    public function markAsVoided()
    {
        $this->status = 'voided';
        $this->save();
        
        // Restore stock for all items
        foreach ($this->items as $item) {
            if ($item->product) {
                $item->product->stock_quantity += $item->quantity;
                $item->product->save();
            }
            
            if ($item->productVariant) {
                $item->productVariant->stock_quantity += $item->quantity;
                $item->productVariant->save();
            }
        }
    }

    public function markAsRefunded()
    {
        $this->status = 'refunded';
        $this->save();
    }
}