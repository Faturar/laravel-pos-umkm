<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\Outlet;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SyncController extends Controller
{
    /**
     * Push offline transactions to server.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pushTransactions(Request $request): JsonResponse
    {
        $user = auth()->user();
        $transactions = $request->input('transactions', []);
        
        if (empty($transactions)) {
            return ApiResponse::error('No transactions provided', ['message' => 'Transactions array is empty'], 400);
        }
        
        $processedTransactions = [];
        $failedTransactions = [];
        
        foreach ($transactions as $transactionData) {
            try {
                // Check if transaction already exists (by UUID or local ID)
                $existingTransaction = Transaction::where('uuid', $transactionData['uuid'] ?? null)
                    ->orWhere('id', $transactionData['id'] ?? null)
                    ->first();
                
                if ($existingTransaction) {
                    // Skip or update existing transaction
                    $failedTransactions[] = [
                        'id' => $transactionData['id'] ?? null,
                        'uuid' => $transactionData['uuid'] ?? null,
                        'reason' => 'Transaction already exists'
                    ];
                    continue;
                }
                
                // Create new transaction
                $transaction = new Transaction();
                $transaction->fill($transactionData);
                $transaction->outlet_id = $user->outlet_id;
                $transaction->user_id = $user->id;
                $transaction->status = 'completed';
                $transaction->is_synced = true;
                $transaction->save();
                
                // Process transaction items if provided
                if (isset($transactionData['items']) && is_array($transactionData['items'])) {
                    foreach ($transactionData['items'] as $itemData) {
                        $item = new \App\Models\TransactionItem();
                        $item->fill($itemData);
                        $item->transaction_id = $transaction->id;
                        $item->save();
                        
                        // Update product stock
                        if (isset($itemData['product_id'])) {
                            $product = Product::find($itemData['product_id']);
                            if ($product) {
                                $product->stock -= $itemData['quantity'];
                                $product->save();
                                
                                // Record stock movement
                                \App\Models\StockMovement::create([
                                    'product_id' => $product->id,
                                    'transaction_id' => $transaction->id,
                                    'type' => 'out',
                                    'quantity' => $itemData['quantity'],
                                    'before_quantity' => $product->stock + $itemData['quantity'],
                                    'after_quantity' => $product->stock,
                                    'notes' => 'Stock reduction from offline transaction',
                                    'user_id' => $user->id,
                                    'outlet_id' => $user->outlet_id,
                                ]);
                            }
                        }
                    }
                }
                
                $processedTransactions[] = $transaction;
                
            } catch (\Exception $e) {
                $failedTransactions[] = [
                    'id' => $transactionData['id'] ?? null,
                    'uuid' => $transactionData['uuid'] ?? null,
                    'reason' => $e->getMessage()
                ];
            }
        }
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'sync_transactions',
            'model_type' => 'App\Models\Transaction',
            'description' => "Synced " . count($processedTransactions) . " offline transactions",
            'data' => json_encode([
                'processed' => count($processedTransactions),
                'failed' => count($failedTransactions)
            ]),
            'outlet_id' => $user->outlet_id,
        ]);
        
        return ApiResponse::success([
            'processed' => count($processedTransactions),
            'failed' => count($failedTransactions),
            'failed_transactions' => $failedTransactions
        ], 'Transactions sync completed');
    }
    
    /**
     * Pull products for offline use.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pullProducts(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Product::query();
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Include variants
        $query->with(['variants', 'category']);
        
        // Only active products
        $query->where('is_active', true);
        
        $products = $query->get();
        
        return ApiResponse::success($products, 'Products retrieved for offline sync');
    }
    
    /**
     * Pull categories for offline use.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pullCategories(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Category::query();
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Only active categories
        $query->where('is_active', true);
        
        $categories = $query->get();
        
        return ApiResponse::success($categories, 'Categories retrieved for offline sync');
    }
    
    /**
     * Pull combos for offline use.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pullCombos(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Combo::query();
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Include items and related products/variants
        $query->with(['items.product', 'items.variant']);
        
        // Only active combos
        $query->where('is_active', true);
        
        $combos = $query->get();
        
        return ApiResponse::success($combos, 'Combos retrieved for offline sync');
    }
    
    /**
     * Pull settings for offline use.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function pullSettings(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Setting::query();
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Also get global settings
        $globalSettings = Setting::whereNull('outlet_id')->get();
        $outletSettings = $query->get();
        
        $settings = $globalSettings->merge($outletSettings);
        
        // Convert to key-value pairs
        $settingsArray = [];
        foreach ($settings as $setting) {
            $value = $setting->value;
            
            // Decode JSON values
            if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $value = $decoded;
                }
            }
            
            $settingsArray[$setting->key] = $value;
        }
        
        return ApiResponse::success($settingsArray, 'Settings retrieved for offline sync');
    }
    
    /**
     * Get sync status.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function syncStatus(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        // Get unsynced transactions count
        $unsyncedCount = Transaction::where('outlet_id', $user->outlet_id)
            ->where('is_synced', false)
            ->count();
        
        // Get last sync time
        $lastSync = \App\Models\AuditLog::where('user_id', $user->id)
            ->where('action', 'sync_transactions')
            ->orderBy('created_at', 'desc')
            ->first();
        
        return ApiResponse::success([
            'unsynced_transactions' => $unsyncedCount,
            'last_sync' => $lastSync ? $lastSync->created_at : null,
            'status' => $unsyncedCount > 0 ? 'pending' : 'synced'
        ], 'Sync status retrieved');
    }
}