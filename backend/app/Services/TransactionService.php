<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionItemDetail;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Combo;
use App\Models\StockMovement;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransactionService
{
    /**
     * Create a new transaction.
     *
     * @param array $data
     * @return Transaction
     */
    public function createTransaction(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $user = Auth::user();
            $outletId = $data['outlet_id'] ?? ($user->outlet_id ?? 1);
            
            // Generate invoice number
            $invoiceNumber = $this->generateInvoiceNumber($outletId);
            
            // Calculate totals
            $subtotal = 0;
            $items = [];
            
            foreach ($data['items'] as $item) {
                // Check if item is a combo
                if (isset($item['type']) && $item['type'] === 'combo') {
                    $combo = Combo::findOrFail($item['combo_id']);
                    
                    // Check if combo is active
                    if (!$combo->is_active) {
                        throw new \Exception("Combo {$combo->name} is not active");
                    }
                    
                    // Check if combo has enough stock
                    if (!$combo->hasEnoughStock($item['qty'])) {
                        throw new \Exception("Insufficient stock for combo {$combo->name}");
                    }
                    
                    $price = $item['price'] ?? $combo->price;
                    $itemTotal = $price * $item['qty'];
                    $subtotal += $itemTotal;
                    
                    $items[] = [
                        'type' => 'combo',
                        'name' => $combo->name,
                        'combo_id' => $combo->id,
                        'quantity' => $item['qty'],
                        'price' => $price,
                        'subtotal' => $itemTotal,
                        'total_price' => $itemTotal,
                        'notes' => $item['notes'] ?? null,
                    ];
                } else {
                    // Regular product
                    $product = Product::findOrFail($item['product_id']);
                    
                    // Check if product is available
                    if (!$product->is_active) {
                        throw new \Exception("Product {$product->name} is not active");
                    }
                    
                    // Check stock if applicable
                    if ($product->track_stock && $product->stock_quantity < $item['qty']) {
                        throw new \Exception("Insufficient stock for product {$product->name}");
                    }
                    
                    $price = $item['price'] ?? $product->price;
                    $variant = null;
                    
                    if (!empty($item['variant_id'])) {
                        $variant = ProductVariant::findOrFail($item['variant_id']);
                        
                        if ($variant->track_stock && $variant->stock < $item['qty']) {
                            throw new \Exception("Insufficient stock for variant {$variant->name}");
                        }
                        
                        $price = $item['price'] ?? $variant->price;
                    }
                    
                    $itemTotal = $price * $item['qty'];
                    $subtotal += $itemTotal;
                    
                    $items[] = [
                        'type' => 'product',
                        'name' => $product->name,
                        'product_id' => $item['product_id'],
                        'variant_id' => $item['variant_id'] ?? null,
                        'quantity' => $item['qty'],
                        'price' => $price,
                        'subtotal' => $itemTotal,
                        'total_price' => $itemTotal,
                        'notes' => $item['notes'] ?? null,
                    ];
                }
            }
            
            // Calculate discount
            $discountAmount = $data['discount'] ?? 0;
            
            // Calculate tax
            $taxRate = $this->getTaxRate($outletId);
            $taxAmount = $subtotal * ($taxRate / 100);
            
            // Calculate service charge
            $serviceChargeRate = $this->getServiceChargeRate($outletId);
            $serviceChargeAmount = $subtotal * ($serviceChargeRate / 100);
            
            // Calculate total
            $totalAmount = $subtotal - $discountAmount + $taxAmount + $serviceChargeAmount;
            
            // Calculate change
            $paidAmount = $data['paid_amount'] ?? $totalAmount;
            $changeAmount = $paidAmount - $totalAmount;
            
            // Create transaction
            $transaction = Transaction::create([
                'uuid' => (string) Str::uuid(),
                'invoice_number' => $invoiceNumber,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'service_charge_amount' => $serviceChargeAmount,
                'total_amount' => $totalAmount,
                'final_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'change_amount' => $changeAmount,
                'payment_method' => $data['payment_method'],
                'payment_reference' => $data['payment_reference'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'completed',
                'cashier_id' => $user->id,
                'customer_id' => $data['customer_id'] ?? null,
                'outlet_id' => $outletId,
            ]);
            
            // Create transaction items
            foreach ($items as $item) {
                $transactionItem = $transaction->items()->create($item);
                
                // Handle stock based on item type
                if ($item['type'] === 'combo') {
                    // Process combo items
                    $combo = Combo::find($item['combo_id']);
                    
                    foreach ($combo->items as $comboItem) {
                        $product = $comboItem->product;
                        $variant = $comboItem->variant;
                        
                        // Create transaction item detail
                        TransactionItemDetail::create([
                            'transaction_item_id' => $transactionItem->id,
                            'product_id' => $product->id,
                            'variant_id' => $variant ? $variant->id : null,
                            'qty' => $comboItem->qty * $item['quantity'],
                            'cost' => $variant ? $variant->cost : $product->cost,
                        ]);
                        
                        // Update product stock
                        if ($product->track_stock) {
                            $product->decrement('stock_quantity', $comboItem->qty * $item['quantity']);
                            
                            // Record stock movement
                            $beforeQuantity = $product->stock_quantity;
                            $afterQuantity = $product->stock_quantity - ($comboItem->qty * $item['quantity']);
                            StockMovement::create([
                                'product_id' => $product->id,
                                'variant_id' => $variant ? $variant->id : null,
                                'type' => 'out',
                                'quantity' => -($comboItem->qty * $item['quantity']),
                                'before_quantity' => $beforeQuantity,
                                'after_quantity' => $afterQuantity,
                                'transaction_id' => $transaction->id,
                                'user_id' => Auth::id(),
                                'notes' => "Sale in combo: {$combo->name} ({$transaction->invoice_number})",
                                'outlet_id' => $outletId,
                            ]);
                        }
                        
                        // Update variant stock if applicable
                        if ($variant && $variant->track_stock) {
                            $variant->decrement('stock', $comboItem->qty * $item['quantity']);
                        }
                    }
                } else {
                    // Regular product
                    $product = Product::find($item['product_id']);
                    if ($product->track_stock) {
                        $product->decrement('stock_quantity', $item['quantity']);
                        
                        // Record stock movement
                        $beforeQuantity = $product->stock_quantity;
                        $afterQuantity = $product->stock_quantity - $item['quantity'];
                        StockMovement::create([
                            'product_id' => $product->id,
                            'variant_id' => $item['variant_id'],
                            'type' => 'out',
                            'quantity' => -$item['quantity'],
                            'before_quantity' => $beforeQuantity,
                            'after_quantity' => $afterQuantity,
                            'transaction_id' => $transaction->id,
                            'user_id' => Auth::id(),
                            'notes' => "Sale: {$transaction->invoice_number}",
                            'outlet_id' => $outletId,
                        ]);
                    }
                    
                    // Update variant stock if applicable
                    if ($item['variant_id']) {
                        $variant = ProductVariant::find($item['variant_id']);
                        if ($variant->track_stock) {
                            $variant->decrement('stock', $item['quantity']);
                        }
                    }
                }
            }
            
            // Log audit
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'create_transaction',
                'model_type' => 'App\\Models\\Transaction',
                'model_id' => $transaction->id,
                'description' => "Created transaction {$transaction->invoice_number}",
                'data' => json_encode($transaction->toArray()),
                'outlet_id' => $outletId,
            ]);
            
            return $transaction->load(['items.product', 'items.variant', 'cashier', 'customer', 'outlet']);
        });
    }
    
    /**
     * Update an existing transaction.
     *
     * @param Transaction $transaction
     * @param array $data
     * @return Transaction
     */
    public function updateTransaction(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $user = Auth::user();
            
            // Only allow updating transactions that are not completed or voided
            if (in_array($transaction->status, ['completed', 'voided', 'refunded'])) {
                throw new \Exception("Cannot update a {$transaction->status} transaction");
            }
            
            // Update transaction details
            $transaction->update([
                'notes' => $data['notes'] ?? $transaction->notes,
                'customer_id' => $data['customer_id'] ?? $transaction->customer_id,
            ]);
            
            // Log audit
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'update_transaction',
                'model_type' => 'App\\Models\\Transaction',
                'model_id' => $transaction->id,
                'description' => "Updated transaction {$transaction->invoice_number}",
                'data' => json_encode($transaction->toArray()),
                'outlet_id' => $transaction->outlet_id,
            ]);
            
            return $transaction->load(['items.product', 'items.variant', 'cashier', 'customer', 'outlet']);
        });
    }
    
    /**
     * Void a transaction.
     *
     * @param Transaction $transaction
     * @param string $reason
     * @return Transaction
     */
    public function voidTransaction(Transaction $transaction, string $reason): Transaction
    {
        return DB::transaction(function () use ($transaction, $reason) {
            $user = Auth::user();
            
            // Only allow voiding completed transactions
            if ($transaction->status !== 'completed') {
                throw new \Exception("Only completed transactions can be voided");
            }
            
            // Update transaction status
            $transaction->update([
                'status' => 'voided',
                'is_void' => true,
                'void_reason' => $reason,
                'voided_at' => now(),
                'voided_by' => $user->id,
            ]);
            
            // Restore stock
            foreach ($transaction->items as $item) {
                if ($item->isCombo()) {
                    // Restore stock for combo items
                    foreach ($item->details as $detail) {
                        $product = Product::find($detail->product_id);
                        $variant = $detail->variant_id ? ProductVariant::find($detail->variant_id) : null;
                        
                        if ($product->track_stock) {
                            $product->increment('stock_quantity', $detail->qty);
                            
                            // Record stock movement
                            $beforeQuantity = $product->stock_quantity;
                            $afterQuantity = $product->stock_quantity + $detail->qty;
                            StockMovement::create([
                                'product_id' => $product->id,
                                'variant_id' => $detail->variant_id,
                                'type' => 'in',
                                'quantity' => $detail->qty,
                                'before_quantity' => $beforeQuantity,
                                'after_quantity' => $afterQuantity,
                                'transaction_id' => $transaction->id,
                                'user_id' => Auth::id(),
                                'notes' => "Void combo: {$item->name} ({$transaction->invoice_number})",
                                'outlet_id' => $transaction->outlet_id,
                            ]);
                        }
                        
                        // Update variant stock if applicable
                        if ($variant && $variant->track_stock) {
                            $variant->increment('stock', $detail->qty);
                        }
                    }
                } else {
                    // Regular product
                    $product = Product::find($item->product_id);
                    if ($product->track_stock) {
                        $product->increment('stock_quantity', $item->quantity);
                        
                        // Record stock movement
                        $beforeQuantity = $product->stock_quantity;
                        $afterQuantity = $product->stock_quantity + $item->quantity;
                        StockMovement::create([
                            'product_id' => $product->id,
                            'variant_id' => $item->variant_id,
                            'type' => 'in',
                            'quantity' => $item->quantity,
                            'before_quantity' => $beforeQuantity,
                            'after_quantity' => $afterQuantity,
                            'transaction_id' => $transaction->id,
                            'user_id' => Auth::id(),
                            'notes' => "Void: {$transaction->invoice_number}",
                            'outlet_id' => $transaction->outlet_id,
                        ]);
                    }
                    
                    // Update variant stock if applicable
                    if ($item->variant_id) {
                        $variant = ProductVariant::find($item->variant_id);
                        if ($variant->track_stock) {
                            $variant->increment('stock', $item->quantity);
                        }
                    }
                }
            }
            
            // Log audit
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'void_transaction',
                'model_type' => 'App\\Models\\Transaction',
                'model_id' => $transaction->id,
                'description' => "Voided transaction {$transaction->invoice_number}. Reason: {$reason}",
                'data' => json_encode($transaction->toArray()),
                'outlet_id' => $transaction->outlet_id,
            ]);
            
            return $transaction->load(['items.product', 'items.variant', 'cashier', 'customer', 'outlet']);
        });
    }
    
    /**
     * Refund a transaction.
     *
     * @param Transaction $transaction
     * @param array $data
     * @return Transaction
     */
    public function refundTransaction(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $user = Auth::user();
            
            // Only allow refunding completed transactions
            if ($transaction->status !== 'completed') {
                throw new \Exception("Only completed transactions can be refunded");
            }
            
            // Calculate refund amount
            $refundAmount = $data['refund_amount'] ?? $transaction->total_amount;
            
            // Create refund transaction
            $refundTransaction = Transaction::create([
                'uuid' => (string) Str::uuid(),
                'invoice_number' => $this->generateInvoiceNumber($transaction->outlet_id) . '-REF',
                'subtotal' => -$transaction->subtotal,
                'discount_amount' => -$transaction->discount_amount,
                'tax_amount' => -$transaction->tax_amount,
                'service_charge_amount' => -$transaction->service_charge_amount,
                'total_amount' => -$refundAmount,
                'final_amount' => -$refundAmount,
                'paid_amount' => -$refundAmount,
                'change_amount' => 0,
                'payment_method' => $transaction->payment_method,
                'payment_reference' => $data['payment_reference'] ?? null,
                'notes' => "Refund for {$transaction->invoice_number}. Reason: {$data['refund_reason']}",
                'status' => 'refunded',
                'cashier_id' => $user->id,
                'customer_id' => $transaction->customer_id,
                'outlet_id' => $transaction->outlet_id,
                'original_transaction_id' => $transaction->id,
            ]);
            
            // Create refund items
            $itemsToRefund = $data['items_to_refund'] ?? $transaction->items->pluck('id')->toArray();
            
            foreach ($transaction->items as $item) {
                if (in_array($item->id, $itemsToRefund)) {
                    $refundItem = $refundTransaction->items()->create([
                        'type' => $item->type,
                        'name' => $item->name,
                        'product_id' => $item->product_id,
                        'variant_id' => $item->variant_id,
                        'combo_id' => $item->combo_id,
                        'quantity' => -$item->quantity,
                        'price' => $item->price,
                        'subtotal' => -$item->total_price,
                        'total_price' => -$item->total_price,
                        'notes' => $item->notes,
                    ]);
                    
                    // Restore stock based on item type
                    if ($item->isCombo()) {
                        // Restore stock for combo items
                        foreach ($item->details as $detail) {
                            $product = Product::find($detail->product_id);
                            $variant = $detail->variant_id ? ProductVariant::find($detail->variant_id) : null;
                            
                            // Create transaction item detail for refund
                            TransactionItemDetail::create([
                                'transaction_item_id' => $refundItem->id,
                                'product_id' => $product->id,
                                'variant_id' => $detail->variant_id,
                                'qty' => -$detail->qty,
                                'cost' => $detail->cost,
                            ]);
                            
                            if ($product->track_stock) {
                                $product->increment('stock_quantity', $detail->qty);
                                
                                // Record stock movement
                                $beforeQuantity = $product->stock_quantity;
                                $afterQuantity = $product->stock_quantity + $detail->qty;
                                StockMovement::create([
                                    'product_id' => $product->id,
                                    'variant_id' => $detail->variant_id,
                                    'type' => 'in',
                                    'quantity' => $detail->qty,
                                    'before_quantity' => $beforeQuantity,
                                    'after_quantity' => $afterQuantity,
                                    'transaction_id' => $refundTransaction->id,
                                    'user_id' => Auth::id(),
                                    'notes' => "Refund combo: {$item->name} ({$transaction->invoice_number})",
                                    'outlet_id' => $transaction->outlet_id,
                                ]);
                            }
                            
                            // Update variant stock if applicable
                            if ($variant && $variant->track_stock) {
                                $variant->increment('stock', $detail->qty);
                            }
                        }
                    } else {
                        // Regular product
                        $product = Product::find($item->product_id);
                        if ($product->track_stock) {
                            $product->increment('stock_quantity', $item->quantity);
                            
                            // Record stock movement
                            $beforeQuantity = $product->stock_quantity;
                            $afterQuantity = $product->stock_quantity + $item->quantity;
                            StockMovement::create([
                                'product_id' => $product->id,
                                'variant_id' => $item->variant_id,
                                'type' => 'in',
                                'quantity' => $item->quantity,
                                'before_quantity' => $beforeQuantity,
                                'after_quantity' => $afterQuantity,
                                'transaction_id' => $refundTransaction->id,
                                'user_id' => Auth::id(),
                                'notes' => "Refund: {$transaction->invoice_number}",
                                'outlet_id' => $transaction->outlet_id,
                            ]);
                        }
                        
                        // Update variant stock if applicable
                        if ($item->variant_id) {
                            $variant = ProductVariant::find($item->variant_id);
                            if ($variant->track_stock) {
                                $variant->increment('stock', $item->quantity);
                            }
                        }
                    }
                }
            }
            
            // Update original transaction status
            $transaction->update([
                'status' => 'refunded',
                'is_refund' => true,
                'refunded_at' => now(),
                'refunded_by' => $user->id,
                'refund_reason' => $data['refund_reason'],
                'refund_amount' => $refundAmount,
                'refund_transaction_id' => $refundTransaction->id,
            ]);
            
            // Log audit
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'refund_transaction',
                'model_type' => 'App\\Models\\Transaction',
                'model_id' => $transaction->id,
                'description' => "Refunded transaction {$transaction->invoice_number}. Amount: {$refundAmount}. Reason: {$data['refund_reason']}",
                'data' => json_encode($transaction->toArray()),
                'outlet_id' => $transaction->outlet_id,
            ]);
            
            return $transaction->load(['items.product', 'items.variant', 'cashier', 'customer', 'outlet']);
        });
    }
    
    /**
     * Get daily summary of transactions.
     *
     * @param string $date
     * @param int $outletId
     * @return array
     */
    public function getDailySummary(string $date, int $outletId): array
    {
        $transactions = Transaction::whereDate('created_at', $date)
            ->where('outlet_id', $outletId)
            ->where('status', 'completed')
            ->get();
        
        $totalTransactions = $transactions->count();
        $totalSales = $transactions->sum('total_amount');
        $totalDiscount = $transactions->sum('discount_amount');
        $totalTax = $transactions->sum('tax_amount');
        $totalServiceCharge = $transactions->sum('service_charge_amount');
        
        $paymentMethods = $transactions->groupBy('payment_method')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'amount' => $group->sum('total_amount'),
                ];
            });
        
        return [
            'date' => $date,
            'total_transactions' => $totalTransactions,
            'total_sales' => $totalSales,
            'total_discount' => $totalDiscount,
            'total_tax' => $totalTax,
            'total_service_charge' => $totalServiceCharge,
            'payment_methods' => $paymentMethods,
        ];
    }
    
    /**
     * Generate receipt data for a transaction.
     *
     * @param Transaction $transaction
     * @return array
     */
    public function generateReceiptData(Transaction $transaction): array
    {
        $outlet = $transaction->outlet;
        $settings = Setting::getSettings($outlet->id);
        
        return [
            'outlet' => [
                'name' => $outlet->name,
                'address' => $outlet->address,
                'phone' => $outlet->phone,
            ],
            'transaction' => [
                'invoice_number' => $transaction->invoice_number,
                'date' => $transaction->created_at->format('Y-m-d H:i:s'),
                'cashier' => $transaction->cashier->name,
                'customer' => $transaction->customer ? $transaction->customer->name : null,
                'payment_method' => $transaction->payment_method,
                'payment_reference' => $transaction->payment_reference,
            ],
            'items' => $transaction->items->map(function ($item) {
                if ($item->isCombo()) {
                    return [
                        'name' => $item->name,
                        'type' => 'combo',
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total_price' => $item->total_price,
                        'details' => $item->details->map(function ($detail) {
                            return [
                                'product_name' => $detail->product->name,
                                'variant_name' => $detail->variant ? $detail->variant->name : null,
                                'quantity' => $detail->qty,
                            ];
                        }),
                    ];
                } else {
                    return [
                        'name' => $item->product->name,
                        'type' => 'product',
                        'variant_name' => $item->variant ? $item->variant->name : null,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total_price' => $item->total_price,
                    ];
                }
            }),
            'summary' => [
                'subtotal' => $transaction->subtotal,
                'discount' => $transaction->discount_amount,
                'tax' => $transaction->tax_amount,
                'service_charge' => $transaction->service_charge_amount,
                'total' => $transaction->total_amount,
                'paid' => $transaction->paid_amount,
                'change' => $transaction->change_amount,
            ],
            'payment_info' => [
                'payment_method' => $transaction->payment_method,
                'payment_reference' => $transaction->payment_reference,
                'paid_amount' => $transaction->paid_amount,
                'change_amount' => $transaction->change_amount,
            ],
            'footer' => $settings['receipt_footer'] ?? 'Thank you for your purchase!',
        ];
    }
    
    /**
     * Get transaction statistics.
     *
     * @param string $fromDate
     * @param string $toDate
     * @param int $outletId
     * @return array
     */
    public function getTransactionStatistics(string $fromDate, string $toDate, int $outletId): array
    {
        $transactions = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('outlet_id', $outletId)
            ->where('status', 'completed')
            ->get();
        
        $totalTransactions = $transactions->count();
        $totalSales = $transactions->sum('total_amount');
        $averageTransaction = $totalTransactions > 0 ? $totalSales / $totalTransactions : 0;
        
        // Group by day
        $dailySales = $transactions->groupBy(function ($transaction) {
            return $transaction->created_at->format('Y-m-d');
        })->map(function ($dayTransactions) {
            return [
                'count' => $dayTransactions->count(),
                'amount' => $dayTransactions->sum('total_amount'),
            ];
        });
        
        // Top products
        $productIds = TransactionItem::whereHas('transaction', function ($query) use ($fromDate, $toDate, $outletId) {
            $query->whereBetween('created_at', [$fromDate, $toDate])
                ->where('outlet_id', $outletId)
                ->where('status', 'completed');
        })->groupBy('product_id')
        ->selectRaw('product_id, SUM(quantity) as total_quantity, SUM(total_price) as total_amount')
        ->orderBy('total_quantity', 'desc')
        ->limit(10)
        ->get();
        
        $topProducts = $productIds->map(function ($item) {
            $product = Product::find($item->product_id);
            return [
                'id' => $product->id,
                'name' => $product->name,
                'quantity' => $item->total_quantity,
                'amount' => $item->total_amount,
            ];
        });
        
        // Payment methods
        $paymentMethods = $transactions->groupBy('payment_method')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'amount' => $group->sum('total_amount'),
                ];
            });
        
        return [
            'period' => [
                'from' => $fromDate,
                'to' => $toDate,
            ],
            'summary' => [
                'total_transactions' => $totalTransactions,
                'total_sales' => $totalSales,
                'average_transaction' => $averageTransaction,
            ],
            'daily_sales' => $dailySales,
            'top_products' => $topProducts,
            'payment_methods' => $paymentMethods,
        ];
    }
    
    /**
     * Generate a unique invoice number.
     *
     * @param int $outletId
     * @return string
     */
    private function generateInvoiceNumber(int $outletId): string
    {
        $outlet = \App\Models\Outlet::find($outletId);
        $prefix = $outlet ? $outlet->code : 'POS';
        $date = now()->format('Ymd');
        $sequence = Transaction::whereDate('created_at', now())
            ->where('outlet_id', $outletId)
            ->count() + 1;
        
        return "{$prefix}-{$date}-{$sequence}";
    }
    
    /**
     * Get the tax rate for an outlet.
     *
     * @param int $outletId
     * @return float
     */
    private function getTaxRate(int $outletId): float
    {
        $setting = Setting::where('key', 'tax_rate')
            ->where('outlet_id', $outletId)
            ->first();
        
        return $setting ? (float) $setting->value : 0;
    }
    
    /**
     * Get the service charge rate for an outlet.
     *
     * @param int $outletId
     * @return float
     */
    private function getServiceChargeRate(int $outletId): float
    {
        $setting = Setting::where('key', 'service_charge_rate')
            ->where('outlet_id', $outletId)
            ->first();
        
        return $setting ? (float) $setting->value : 0;
    }
}