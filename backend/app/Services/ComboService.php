<?php

namespace App\Services;

use App\Models\Combo;
use App\Models\ComboItem;
use App\Models\TransactionItem;
use App\Models\TransactionItemDetail;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ComboService
{
    /**
     * Create a new combo with items.
     */
    public function createCombo(array $data)
    {
        return DB::transaction(function () use ($data) {
            $combo = Combo::create([
                'name' => $data['name'],
                'price' => $data['price'],
                'is_active' => $data['is_active'] ?? true,
                'outlet_id' => $data['outlet_id'] ?? null,
            ]);

            // Create combo items
            foreach ($data['items'] as $item) {
                ComboItem::create([
                    'combo_id' => $combo->id,
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'qty' => $item['qty'] ?? 1,
                ]);
            }

            return $combo->load('items.product', 'items.variant');
        });
    }

    /**
     * Update an existing combo.
     */
    public function updateCombo(Combo $combo, array $data)
    {
        return DB::transaction(function () use ($combo, $data) {
            $combo->update([
                'name' => $data['name'] ?? $combo->name,
                'price' => $data['price'] ?? $combo->price,
                'is_active' => $data['is_active'] ?? $combo->is_active,
                'outlet_id' => $data['outlet_id'] ?? $combo->outlet_id,
            ]);

            // Update combo items if provided
            if (isset($data['items'])) {
                // Remove existing items
                $combo->items()->delete();

                // Create new items
                foreach ($data['items'] as $item) {
                    ComboItem::create([
                        'combo_id' => $combo->id,
                        'product_id' => $item['product_id'],
                        'variant_id' => $item['variant_id'] ?? null,
                        'qty' => $item['qty'] ?? 1,
                    ]);
                }
            }

            return $combo->load('items.product', 'items.variant');
        });
    }

    /**
     * Delete a combo.
     */
    public function deleteCombo(Combo $combo)
    {
        return DB::transaction(function () use ($combo) {
            $combo->items()->delete();
            return $combo->delete();
        });
    }

    /**
     * Check if a combo has enough stock for the given quantity.
     */
    public function checkComboStock(Combo $combo, $quantity = 1)
    {
        $result = [
            'available' => true,
            'max_qty' => $combo->getMaxQuantity(),
            'insufficient_items' => []
        ];

        if ($result['max_qty'] < $quantity) {
            $result['available'] = false;

            // Find which items are insufficient
            foreach ($combo->items as $item) {
                $product = $item->product;
                
                if ($item->variant_id) {
                    $variant = $item->variant;
                    if ($variant && $variant->stock < ($item->qty * $quantity)) {
                        $result['insufficient_items'][] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'variant_id' => $variant->id,
                            'variant_name' => $variant->name,
                            'required' => $item->qty * $quantity,
                            'available' => $variant->stock
                        ];
                    }
                } else {
                    if ($product->stock < ($item->qty * $quantity)) {
                        $result['insufficient_items'][] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'variant_id' => null,
                            'variant_name' => null,
                            'required' => $item->qty * $quantity,
                            'available' => $product->stock
                        ];
                    }
                }
            }
        }

        return $result;
    }

    /**
     * Process a combo in a transaction.
     */
    public function processComboInTransaction(TransactionItem $transactionItem, Combo $combo, $quantity)
    {
        return DB::transaction(function () use ($transactionItem, $combo, $quantity) {
            // Create transaction item details for each item in the combo
            foreach ($combo->items as $item) {
                $product = $item->product;
                $variant = $item->variant;
                $cost = $variant ? $variant->cost : $product->cost;
                
                // Create detail record
                $detail = TransactionItemDetail::create([
                    'transaction_item_id' => $transactionItem->id,
                    'product_id' => $product->id,
                    'variant_id' => $variant ? $variant->id : null,
                    'qty' => $item->qty * $quantity,
                    'cost' => $cost
                ]);

                // Deduct stock
                if ($variant) {
                    $variant->decrement('stock', $item->qty * $quantity);
                    
                    // Create stock movement record for variant
                    StockMovement::create([
                        'product_id' => $product->id,
                        'variant_id' => $variant->id,
                        'type' => 'sale',
                        'quantity' => -($item->qty * $quantity),
                        'reference_type' => 'transaction_item',
                        'reference_id' => $transactionItem->id,
                        'notes' => "Sold in combo: {$combo->name}",
                        'user_id' => auth()->id(),
                        'outlet_id' => $transactionItem->transaction->outlet_id,
                    ]);
                } else {
                    $product->decrement('stock', $item->qty * $quantity);
                    
                    // Create stock movement record for product
                    StockMovement::create([
                        'product_id' => $product->id,
                        'variant_id' => null,
                        'type' => 'sale',
                        'quantity' => -($item->qty * $quantity),
                        'reference_type' => 'transaction_item',
                        'reference_id' => $transactionItem->id,
                        'notes' => "Sold in combo: {$combo->name}",
                        'user_id' => auth()->id(),
                        'outlet_id' => $transactionItem->transaction->outlet_id,
                    ]);
                }
            }

            return $transactionItem->load('details');
        });
    }

    /**
     * Refund a combo transaction.
     */
    public function refundComboTransaction(TransactionItem $transactionItem)
    {
        if (!$transactionItem->isCombo()) {
            throw new \Exception('Transaction item is not a combo');
        }

        return DB::transaction(function () use ($transactionItem) {
            // Get all details for this transaction item
            $details = $transactionItem->details;
            
            foreach ($details as $detail) {
                $product = $detail->product;
                $variant = $detail->variant;
                
                // Restore stock
                if ($variant) {
                    $variant->increment('stock', $detail->qty);
                    
                    // Create stock movement record for variant
                    StockMovement::create([
                        'product_id' => $product->id,
                        'variant_id' => $variant->id,
                        'type' => 'refund',
                        'quantity' => $detail->qty,
                        'reference_type' => 'transaction_item',
                        'reference_id' => $transactionItem->id,
                        'notes' => "Refunded from combo: {$transactionItem->name}",
                        'user_id' => auth()->id(),
                        'outlet_id' => $transactionItem->transaction->outlet_id,
                    ]);
                } else {
                    $product->increment('stock', $detail->qty);
                    
                    // Create stock movement record for product
                    StockMovement::create([
                        'product_id' => $product->id,
                        'variant_id' => null,
                        'type' => 'refund',
                        'quantity' => $detail->qty,
                        'reference_type' => 'transaction_item',
                        'reference_id' => $transactionItem->id,
                        'notes' => "Refunded from combo: {$transactionItem->name}",
                        'user_id' => auth()->id(),
                        'outlet_id' => $transactionItem->transaction->outlet_id,
                    ]);
                }
            }

            return $transactionItem;
        });
    }

    /**
     * Get all active combos for a specific outlet.
     */
    public function getActiveCombosByOutlet($outletId = null)
    {
        $query = Combo::active()->with('items.product', 'items.variant');
        
        if ($outletId) {
            $query->where(function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId)
                  ->orWhereNull('outlet_id');
            });
        }
        
        return $query->get();
    }

    /**
     * Get combo sales report.
     */
    public function getComboSalesReport($startDate = null, $endDate = null, $outletId = null)
    {
        $query = TransactionItem::where('type', 'combo')
            ->whereHas('transaction', function ($q) use ($startDate, $endDate) {
                if ($startDate && $endDate) {
                    $q->whereBetween('created_at', [$startDate, $endDate]);
                }
            });

        if ($outletId) {
            $query->whereHas('transaction', function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId);
            });
        }

        $comboSales = $query->with(['combo', 'transaction'])
            ->get()
            ->groupBy('combo_id');

        $result = [];
        foreach ($comboSales as $comboId => $items) {
            $combo = $items->first()->combo;
            $totalQuantity = $items->sum('quantity');
            $totalRevenue = $items->sum('total_price');
            
            $result[] = [
                'combo_id' => $comboId,
                'combo_name' => $combo->name,
                'combo_price' => $combo->price,
                'total_quantity' => $totalQuantity,
                'total_revenue' => $totalRevenue,
                'items' => $items
            ];
        }

        return $result;
    }

    /**
     * Get combo item details report.
     */
    public function getComboItemDetailsReport($startDate = null, $endDate = null, $outletId = null)
    {
        $query = TransactionItemDetail::whereHas('transactionItem', function ($q) {
            $q->where('type', 'combo');
        })->whereHas('transactionItem.transaction', function ($q) use ($startDate, $endDate) {
            if ($startDate && $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            }
        });

        if ($outletId) {
            $query->whereHas('transactionItem.transaction', function ($q) use ($outletId) {
                $q->where('outlet_id', $outletId);
            });
        }

        return $query->with([
            'transactionItem.combo', 
            'product', 
            'variant'
        ])->get()->groupBy('product_id');
    }
}