<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\Combo;
use App\Models\StockMovement;
use App\Services\ComboService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Get summary report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function summary(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Base query for transactions
        $transactionQuery = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed');
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $transactionQuery->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $transactionQuery->where('outlet_id', $outletId);
        }
        
        // Get transaction stats
        $transactionCount = $transactionQuery->count();
        $totalSales = $transactionQuery->sum('final_amount');
        $averageTransaction = $transactionCount > 0 ? $totalSales / $transactionCount : 0;
        
        // Get payment method breakdown
        $paymentMethods = $transactionQuery->select('payment_method')
            ->selectRaw('COUNT(*) as count, SUM(final_amount) as total')
            ->groupBy('payment_method')
            ->get();
        
        // Get top products
        $topProducts = \App\Models\TransactionItem::join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->whereBetween('transactions.created_at', [$fromDate, $toDate])
            ->where('transactions.status', 'completed')
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('transactions.outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('transactions.outlet_id', $outletId);
            })
            ->select('products.id', 'products.name', 'products.sku')
            ->selectRaw('SUM(transaction_items.quantity) as total_quantity, SUM(transaction_items.subtotal) as total_sales')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get();
        
        // Get stock summary
        $stockQuery = Product::query();
        if (!$user->hasRole(['admin', 'owner'])) {
            $stockQuery->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $stockQuery->where('outlet_id', $outletId);
        }
        
        $totalProducts = $stockQuery->count();
        $lowStockProducts = (clone $stockQuery)->where('stock_quantity', '<=', \Illuminate\Support\Facades\DB::raw('stock_alert_threshold'))->count();
        $outOfStockProducts = (clone $stockQuery)->where('stock_quantity', 0)->count();
        
        // Get today's statistics
        $todayTransactions = Transaction::whereDate('created_at', now())
            ->where('status', 'completed')
            ->when(!$user->hasRole('admin') && !$user->hasRole('owner'), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            });
            
        $todayCount = $todayTransactions->count();
        $todaySales = $todayTransactions->sum('final_amount');
        
        // Get this week's statistics
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();
        $weekTransactions = Transaction::whereBetween('created_at', [$weekStart, $weekEnd])
            ->where('status', 'completed')
            ->when(!$user->hasRole('admin') && !$user->hasRole('owner'), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            });
            
        $weekCount = $weekTransactions->count();
        $weekSales = $weekTransactions->sum('final_amount');
        
        // Get this month's statistics
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();
        $monthTransactions = Transaction::whereBetween('created_at', [$monthStart, $monthEnd])
            ->where('status', 'completed')
            ->when(!$user->hasRole('admin') && !$user->hasRole('owner'), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            });
            
        $monthCount = $monthTransactions->count();
        $monthSales = $monthTransactions->sum('final_amount');
        
        // Get this year's statistics
        $yearStart = now()->startOfYear();
        $yearEnd = now()->endOfYear();
        $yearTransactions = Transaction::whereBetween('created_at', [$yearStart, $yearEnd])
            ->where('status', 'completed')
            ->when(!$user->hasRole('admin') && !$user->hasRole('owner'), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            });
            
        $yearCount = $yearTransactions->count();
        $yearSales = $yearTransactions->sum('final_amount');
        
        return ApiResponse::success([
            'today' => [
                'total_transactions' => $todayCount,
                'total_revenue' => $todaySales,
                'average_transaction' => $todayCount > 0 ? $todaySales / $todayCount : 0,
            ],
            'this_week' => [
                'total_transactions' => $weekCount,
                'total_revenue' => $weekSales,
                'average_transaction' => $weekCount > 0 ? $weekSales / $weekCount : 0,
            ],
            'this_month' => [
                'total_transactions' => $monthCount,
                'total_revenue' => $monthSales,
                'average_transaction' => $monthCount > 0 ? $monthSales / $monthCount : 0,
            ],
            'this_year' => [
                'total_transactions' => $yearCount,
                'total_revenue' => $yearSales,
                'average_transaction' => $yearCount > 0 ? $yearSales / $yearCount : 0,
            ],
        ], 'Summary report retrieved successfully');
    }
    
    /**
     * Get sales report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sales(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Group by
        $groupBy = $request->input('group_by', 'day'); // day, week, month
        
        // Base query
        $query = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed');
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $query->where('outlet_id', $outletId);
        }
        
        // Apply grouping
        switch ($groupBy) {
            case 'day':
                $query->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(final_amount) as total, AVG(final_amount) as average')
                    ->groupBy('date')
                    ->orderBy('date');
                break;
            case 'week':
                $query->selectRaw('YEARWEEK(created_at) as week, COUNT(*) as count, SUM(final_amount) as total, AVG(final_amount) as average')
                    ->groupBy('week')
                    ->orderBy('week');
                break;
            case 'month':
                $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count, SUM(final_amount) as total, AVG(final_amount) as average')
                    ->groupBy('year', 'month')
                    ->orderBy('year')->orderBy('month');
                break;
        }
        
        $sales = $query->get();
        
        // Calculate total revenue and statistics
        $totalRevenue = $query->sum('final_amount');
        $totalTransactions = $query->count();
        $averageTransactionValue = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;
        
        // Find best hour and day
        // Use strftime for SQLite compatibility
        $bestHour = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed')
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            })
            ->selectRaw('strftime("%H", created_at) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->first();
            
        $bestDay = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed')
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            })
            ->selectRaw('strftime("%w", created_at) as day_num, COUNT(*) as count')
            ->groupBy('day_num')
            ->orderBy('count', 'desc')
            ->first();
            
        // Convert day number to day name
        $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $bestDayName = $bestDay ? $dayNames[$bestDay->day_num] : null;
        
        return ApiResponse::success([
            'sales' => $sales,
            'total_revenue' => $totalRevenue,
            'total_transactions' => $totalTransactions,
            'average_transaction_value' => $averageTransactionValue,
            'best_hour' => $bestHour ? $bestHour->hour : null,
            'best_day' => $bestDayName,
        ], 'Sales report retrieved successfully');
    }
    
    /**
     * Get products report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function products(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Get product sales
        $productSales = \App\Models\TransactionItem::join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->whereBetween('transactions.created_at', [$fromDate, $toDate])
            ->where('transactions.status', 'completed')
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('transactions.outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('transactions.outlet_id', $outletId);
            })
            ->select('products.id', 'products.name', 'products.sku', 'products.price', 'categories.name as category_name')
            ->selectRaw('SUM(transaction_items.quantity) as total_quantity, SUM(transaction_items.subtotal) as total_sales')
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.price', 'categories.name')
            ->orderBy('total_quantity', 'desc')
            ->get();
        
        // Get product stock status
        $stockQuery = Product::with('category');
        if (!$user->hasRole(['admin', 'owner'])) {
            $stockQuery->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $stockQuery->where('outlet_id', $outletId);
        }
        
        $stockStatus = $stockQuery->get();
        
        // Calculate total value and statistics
        $totalProducts = $stockStatus->count();
        $totalValue = 0;
        $topProducts = [];
        $lowStockProducts = [];
        
        foreach ($stockStatus as $product) {
            $totalValue += $product->stock_quantity * $product->price;
            
            if ($product->stock_quantity <= $product->min_stock) {
                $lowStockProducts[] = $product;
            }
        }
        
        // Get top products from sales data
        $topProducts = $productSales->take(10);
        
        return ApiResponse::success([
            'products' => $productSales,
            'total_products' => $totalProducts,
            'total_value' => $totalValue,
            'top_products' => $topProducts,
            'low_stock_products' => $lowStockProducts,
        ], 'Products report retrieved successfully');
    }
    
    /**
     * Get payments report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function payments(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Base query
        $query = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed');
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $query->where('outlet_id', $outletId);
        }
        
        // Payment method breakdown
        $paymentMethods = $query->select('payment_method')
            ->selectRaw('COUNT(*) as count, SUM(final_amount) as total, AVG(final_amount) as average')
            ->groupBy('payment_method')
            ->get();
        
        // Cash flow analysis
        $cashFlow = $query->selectRaw('
            SUM(CASE WHEN payment_method = "cash" THEN final_amount ELSE 0 END) as cash_sales,
            SUM(CASE WHEN payment_method != "cash" THEN final_amount ELSE 0 END) as non_cash_sales,
            SUM(final_amount) as total_sales
        ')->first();
        
        // Calculate total amount and transaction count
        $totalAmount = $query->sum('final_amount');
        $transactionsCount = $query->count();
        
        return ApiResponse::success([
            'payment_methods' => $paymentMethods,
            'total_amount' => $totalAmount,
            'transactions_count' => $transactionsCount,
        ], 'Payments report retrieved successfully');
    }
    
    /**
     * Get cash report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function cash(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Base query for transactions
        $transactionQuery = Transaction::whereBetween('created_at', [$fromDate, $toDate])
            ->where('status', 'completed');
        
        // Filter by outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $transactionQuery->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $transactionQuery->where('outlet_id', $outletId);
        }
        
        // Cash transactions
        $cashTransactions = (clone $transactionQuery)->where('payment_method', 'cash');
        $cashIn = $cashTransactions->sum('final_amount');
        
        // Cash out (refunds)
        $refundTransactions = (clone $transactionQuery)->where('is_refund', true);
        $cashOut = $refundTransactions->sum('final_amount');
        
        // Expected cash in drawer
        $expectedCash = $cashIn - $cashOut;
        
        // Get stock movements (cash in/out from inventory)
        $stockMovements = StockMovement::whereBetween('created_at', [$fromDate, $toDate])
            ->where('type', 'in')
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            })
            ->sum('cost');
        
        // Calculate net cash and balances
        $netCash = $cashIn - $cashOut;
        $openingBalance = 0; // This could be stored in settings or calculated from previous day
        $closingBalance = $openingBalance + $netCash;
        
        return ApiResponse::success([
            'cash_in' => $cashIn,
            'cash_out' => $cashOut,
            'net_cash' => $netCash,
            'opening_balance' => $openingBalance,
            'closing_balance' => $closingBalance,
        ], 'Cash report retrieved successfully');
    }
    
    /**
     * Get inventory report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function inventory(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Get stock movements
        $stockMovements = StockMovement::whereBetween('created_at', [$fromDate, $toDate])
            ->when(!$user->hasRole(['admin', 'owner']), function ($query) use ($user) {
                return $query->where('outlet_id', $user->outlet_id);
            })
            ->when($outletId, function ($query) use ($outletId) {
                return $query->where('outlet_id', $outletId);
            })
            ->with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Get inventory summary
        $productQuery = Product::with('category');
        if (!$user->hasRole(['admin', 'owner'])) {
            $productQuery->where('outlet_id', $user->outlet_id);
        } elseif ($outletId) {
            $productQuery->where('outlet_id', $outletId);
        }
        
        $inventorySummary = $productQuery->get();
        
        // Calculate inventory value
        $totalInventoryValue = 0;
        $lowStockCount = 0;
        $outOfStockCount = 0;
        
        foreach ($inventorySummary as $product) {
            $totalInventoryValue += $product->stock_quantity * $product->cost;
            
            if ($product->stock_quantity <= $product->min_stock) {
                $lowStockCount++;
            }
            
            if ($product->stock_quantity == 0) {
                $outOfStockCount++;
            }
        }
        
        // Calculate inventory by category
        $byCategory = [];
        foreach ($inventorySummary as $product) {
            $categoryName = $product->category ? $product->category->name : 'Uncategorized';
            
            if (!isset($byCategory[$categoryName])) {
                $byCategory[$categoryName] = [
                    'total_products' => 0,
                    'total_stock_value' => 0,
                    'low_stock_count' => 0,
                    'out_of_stock_count' => 0,
                ];
            }
            
            $byCategory[$categoryName]['total_products']++;
            $byCategory[$categoryName]['total_stock_value'] += $product->stock_quantity * $product->cost;
            
            if ($product->stock_quantity <= $product->min_stock) {
                $byCategory[$categoryName]['low_stock_count']++;
            }
            
            if ($product->stock_quantity == 0) {
                $byCategory[$categoryName]['out_of_stock_count']++;
            }
        }
        
        return ApiResponse::success([
            'inventory' => $inventorySummary,
            'total_products' => $inventorySummary->count(),
            'total_stock_value' => $totalInventoryValue,
            'low_stock_products' => $lowStockCount,
            'out_of_stock_products' => $outOfStockCount,
            'by_category' => $byCategory,
        ], 'Inventory report retrieved successfully');
    }
    
    /**
     * Get combo sales report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function combos(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Get combo sales using ComboService
        $comboService = app(ComboService::class);
        $comboSales = $comboService->getComboSalesReport($fromDate, $toDate, $outletId);
        
        // Get combo item details report
        $comboItemDetails = $comboService->getComboItemDetailsReport($fromDate, $toDate, $outletId);
        
        // Calculate totals
        $totalCombosSold = 0;
        $totalComboRevenue = 0;
        
        foreach ($comboSales as $sale) {
            $totalCombosSold += $sale['total_quantity'];
            $totalComboRevenue += $sale['total_revenue'];
        }
        
        return ApiResponse::success([
            'combo_sales' => $comboSales,
            'combo_item_details' => $comboItemDetails,
            'total_combos_sold' => $totalCombosSold,
            'total_combo_revenue' => $totalComboRevenue,
        ], 'Combo sales report retrieved successfully');
    }
    
    /**
     * Get combo item details report.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function comboItems(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Date range
        $fromDate = $request->input('from_date', now()->startOfDay());
        $toDate = $request->input('to_date', now()->endOfDay());
        
        // Get combo item details using ComboService
        $comboService = app(ComboService::class);
        $comboItemDetails = $comboService->getComboItemDetailsReport($fromDate, $toDate, $outletId);
        
        // Format the response
        $formattedDetails = [];
        
        foreach ($comboItemDetails as $productId => $details) {
            $product = $details->first()->product;
            
            $formattedDetails[] = [
                'product_id' => $productId,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'total_quantity' => $details->sum('qty'),
                'details' => $details,
            ];
        }
        
        return ApiResponse::success([
            'combo_items' => $formattedDetails,
        ], 'Combo item details report retrieved successfully');
    }
}