<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    /**
     * Display a listing of stocks.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Product::with(['category', 'variants']);
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }
        
        // Filter by stock status
        if ($request->has('stock_status')) {
            switch ($request->input('stock_status')) {
                case 'low':
                    $query->whereColumn('stock_quantity', '<=', 'stock_alert_threshold')->where('stock_quantity', '>', 0);
                    break;
                case 'out':
                    $query->where('stock_quantity', 0);
                    break;
                case 'available':
                    $query->where('stock_quantity', '>', 0)->whereColumn('stock_quantity', '>', 'stock_alert_threshold');
                    break;
            }
        }
        
        // Search by name or SKU
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        
        // Pagination
        $limit = $request->input('limit', 20);
        $products = $query->paginate($limit);
        
        // Transform products to the expected format
        $stockData = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'current_stock' => $product->stock_quantity,
                'outlet_id' => $product->outlet_id,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });
        
        return ApiResponse::success($stockData, 'Stock information retrieved successfully');
    }
    
    /**
     * Get stock movements.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function movements(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = StockMovement::with(['product', 'user']);
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }
        
        // Filter by movement type
        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }
        
        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }
        
        // Order by latest first
        $query->orderBy('created_at', 'desc');
        
        // Pagination
        $limit = $request->input('limit', 20);
        $movements = $query->paginate($limit);
        
        // Transform movements to the expected format
        $movementData = $movements->map(function ($movement) {
            return [
                'id' => $movement->id,
                'product_id' => $movement->product_id,
                'product_name' => $movement->product ? $movement->product->name : '',
                'quantity' => $movement->quantity,
                'before_quantity' => $movement->before_quantity,
                'after_quantity' => $movement->after_quantity,
                'movement_type' => $movement->type,
                'reference' => $movement->reference ?? '',
                'notes' => $movement->notes ?? '',
                'created_at' => $movement->created_at,
            ];
        });
        
        return ApiResponse::success($movementData, 'Stock movements retrieved successfully');
    }
    
    /**
     * Get stock summary.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function summary(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Product::query();
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Get counts
        $totalProducts = (clone $query)->count();
        $lowStockProducts = (clone $query)->whereColumn('stock_quantity', '<=', 'stock_alert_threshold')->where('stock_quantity', '>', 0)->count();
        $outOfStockProducts = (clone $query)->where('stock_quantity', 0)->count();
        
        // Get total inventory value
        $products = $query->get();
        $totalInventoryValue = 0;
        
        foreach ($products as $product) {
            $totalInventoryValue += $product->stock_quantity * $product->cost;
        }
        
        // Get recent stock movements
        $movementsQuery = StockMovement::with(['product', 'user']);
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $movementsQuery->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $movementsQuery->where('outlet_id', $request->input('outlet_id'));
        }
        
        $recentMovements = $movementsQuery->orderBy('created_at', 'desc')->limit(10)->get();
        
        // Get stock by category
        $byCategory = [];
        $categories = \App\Models\Category::all();
        foreach ($categories as $category) {
            $categoryProducts = (clone $query)->where('category_id', $category->id)->get();
            $categoryValue = 0;
            foreach ($categoryProducts as $product) {
                $categoryValue += $product->stock_quantity * $product->cost;
            }
            $byCategory[] = [
                'category_id' => $category->id,
                'category_name' => $category->name,
                'total_products' => $categoryProducts->count(),
                'total_stock_value' => $categoryValue,
            ];
        }
        
        return ApiResponse::success([
            'total_products' => $totalProducts,
            'low_stock_products' => $lowStockProducts,
            'out_of_stock_products' => $outOfStockProducts,
            'total_stock_value' => $totalInventoryValue,
            'by_category' => $byCategory,
        ], 'Stock summary retrieved successfully');
    }
    
    /**
     * Record stock in.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stockIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'cost' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);
        
        $user = Auth::user();
        $product = Product::find($validated['product_id']);
        
        // Check if user has access to this product's outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $product->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this product'], 403);
        }
        
        // Record stock movement
        $beforeStock = $product->stock_quantity;
        $product->stock_quantity += $validated['quantity'];
        $product->save();
        
        $movement = StockMovement::create([
            'product_id' => $product->id,
            'type' => 'in',
            'quantity' => $validated['quantity'],
            'before_quantity' => $beforeStock,
            'after_quantity' => $product->stock_quantity,
            'notes' => $validated['description'] ?? 'Stock in',
            'user_id' => $user->id,
            'outlet_id' => $product->outlet_id,
        ]);
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'stock_in',
            'model_type' => 'App\Models\Product',
            'model_id' => $product->id,
            'description' => "Added {$validated['quantity']} units of stock for product: {$product->name}",
            'data' => json_encode([
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'before_quantity' => $beforeStock,
                'after_quantity' => $product->stock_quantity,
            ]),
            'outlet_id' => $product->outlet_id,
        ]);
        
        return ApiResponse::success([
            'id' => $movement->id,
            'product_id' => $movement->product_id,
            'quantity' => $movement->quantity,
            'before_quantity' => $movement->before_quantity,
            'after_quantity' => $movement->after_quantity,
            'movement_type' => $movement->type,
            'reference' => $movement->reference ?? '',
            'notes' => $movement->notes,
            'created_at' => $movement->created_at,
        ], 'Stock in recorded successfully');
    }
    
    /**
     * Adjust stock.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function adjust(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'new_stock' => 'required|integer|min:0',
            'reason' => 'required|string|max:255',
        ]);
        
        $user = Auth::user();
        $product = Product::find($validated['product_id']);
        
        // Check if user has access to this product's outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $product->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this product'], 403);
        }
        
        $beforeStock = $product->stock_quantity;
        $difference = $validated['new_stock'] - $beforeStock;
        
        // Update stock
        $product->stock_quantity = $validated['new_stock'];
        $product->save();
        
        // Record stock movement
        $type = $difference > 0 ? 'in' : ($difference < 0 ? 'out' : 'adjust');
        $quantity = abs($difference);
        
        if ($difference != 0) {
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity' => $quantity,
                'before_quantity' => $beforeStock,
                'after_quantity' => $product->stock_quantity,
                'notes' => $validated['reason'],
                'user_id' => $user->id,
                'outlet_id' => $product->outlet_id,
            ]);
        }
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'adjust_stock',
            'model_type' => 'App\Models\Product',
            'model_id' => $product->id,
            'description' => "Adjusted stock for product: {$product->name} from {$beforeStock} to {$validated['new_stock']}. Reason: {$validated['reason']}",
            'data' => json_encode([
                'product_id' => $product->id,
                'before_quantity' => $beforeStock,
                'after_quantity' => $validated['new_stock'],
                'difference' => $difference,
                'reason' => $validated['reason'],
            ]),
            'outlet_id' => $product->outlet_id,
        ]);
        
        // Return the movement if it exists, otherwise return a success message
        if (isset($movement)) {
            return ApiResponse::success([
                'id' => $movement->id,
                'product_id' => $movement->product_id,
                'quantity' => $movement->quantity,
                'before_quantity' => $movement->before_quantity,
                'after_quantity' => $movement->after_quantity,
                'movement_type' => $movement->type,
                'reference' => $movement->reference ?? '',
                'notes' => $movement->notes,
                'created_at' => $movement->created_at,
            ], 'Stock adjusted successfully');
        }
        
        return ApiResponse::success([
            'message' => 'Stock adjusted successfully (no movement recorded as stock did not change)',
        ], 'Stock adjusted successfully');
    }
    
    /**
     * Get stock movement summary.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function movementSummary(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = StockMovement::query();
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }
        
        // Get summary data
        $totalStockIn = (clone $query)->where('type', 'in')->sum('quantity');
        $totalStockOut = (clone $query)->whereIn('type', ['out', 'sales_deduction'])->sum('quantity');
        $totalAdjustments = (clone $query)->where('type', 'adjustment')->count();
        
        return ApiResponse::success([
            'total_stock_in' => $totalStockIn,
            'total_stock_out' => $totalStockOut,
            'net_movement' => $totalStockIn - $totalStockOut,
            'total_adjustments' => $totalAdjustments,
        ], 'Stock movement summary retrieved successfully');
    }
    
    /**
     * Get stock movement chart data.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function movementChartData(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = StockMovement::query();
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }
        
        // Get chart data grouped by date
        $chartData = $query->selectRaw('DATE(created_at) as date, 
            SUM(CASE WHEN type = "in" THEN quantity ELSE 0 END) as stock_in,
            SUM(CASE WHEN type IN ("out", "sales_deduction") THEN quantity ELSE 0 END) as stock_out')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        return ApiResponse::success($chartData, 'Stock movement chart data retrieved successfully');
    }
    
    /**
     * Get stock movement by type.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function movementByType(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = StockMovement::query();
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }
        
        // Get movement data grouped by type
        $movementByType = $query->selectRaw('type, SUM(quantity) as total_quantity, COUNT(*) as count')
            ->groupBy('type')
            ->get();
        
        // Format the data
        $formattedData = $movementByType->map(function ($item) {
            $typeLabel = match($item->type) {
                'in' => 'Stock In',
                'out' => 'Stock Out',
                'adjustment' => 'Manual Adjustment',
                'sales_deduction' => 'Sales Deduction',
                'transfer' => 'Transfer',
                default => ucfirst($item->type),
            };
            
            return [
                'type' => $typeLabel,
                'value' => $item->total_quantity,
                'count' => $item->count,
            ];
        });
        
        return ApiResponse::success($formattedData, 'Stock movement by type retrieved successfully');
    }
    
    /**
     * Get most affected products.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function affectedProducts(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = StockMovement::with('product');
        
        // Filter by outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner')) {
            $query->where('outlet_id', $user->outlet_id);
        } elseif ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }
        
        // Get most affected products
        $affectedProducts = $query->selectRaw('product_id, 
            SUM(CASE WHEN type = "in" THEN quantity ELSE 0 END) as stock_in,
            SUM(CASE WHEN type IN ("out", "sales_deduction") THEN quantity ELSE 0 END) as stock_out,
            COUNT(*) as movement_count')
            ->groupBy('product_id')
            ->orderBy('movement_count', 'desc')
            ->limit(10)
            ->get();
        
        // Format the data
        $formattedData = $affectedProducts->map(function ($item) {
            return [
                'name' => $item->product ? $item->product->name : 'Unknown Product',
                'total_movement' => $item->movement_count,
                'stock_in' => $item->stock_in,
                'stock_out' => $item->stock_out,
            ];
        });
        
        return ApiResponse::success($formattedData, 'Most affected products retrieved successfully');
    }
    
    /**
     * Get stock movement detail.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function movementDetail(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $movement = StockMovement::with(['product', 'user', 'outlet'])->find($id);
        
        if (!$movement) {
            return ApiResponse::error('Stock movement not found', ['message' => 'Stock movement not found'], 404);
        }
        
        // Check if user has access to this movement
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $movement->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this stock movement'], 403);
        }
        
        $movementData = [
            'id' => $movement->id,
            'product' => $movement->product ? $movement->product->name : '',
            'sku' => $movement->product ? $movement->product->sku : '',
            'movement_type' => $movement->type,
            'quantity' => $movement->type === 'out' || $movement->type === 'sales_deduction' ? -$movement->quantity : $movement->quantity,
            'before_quantity' => $movement->before_quantity,
            'after_quantity' => $movement->after_quantity,
            'reference' => $movement->reference ?? '',
            'notes' => $movement->notes ?? '',
            'date' => $movement->created_at,
            'user' => $movement->user ? $movement->user->name : '',
            'outlet' => $movement->outlet ? $movement->outlet->name : '',
        ];
        
        return ApiResponse::success($movementData, 'Stock movement detail retrieved successfully');
    }
    
    /**
     * Create stock adjustment.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stockAdjustment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'reason' => 'required|string|max:255',
            'outlet_id' => 'nullable|exists:outlets,id',
        ]);
        
        $user = Auth::user();
        $product = Product::find($validated['product_id']);
        
        // Check if user has access to this product's outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $product->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this product'], 403);
        }
        
        $beforeStock = $product->stock_quantity;
        $newStock = $beforeStock + $validated['quantity'];
        
        // Ensure stock doesn't go negative
        if ($newStock < 0) {
            return ApiResponse::error('Invalid stock quantity', ['message' => 'Stock quantity cannot be negative'], 422);
        }
        
        // Update stock
        $product->stock_quantity = $newStock;
        $product->save();
        
        // Record stock movement
        $type = $validated['quantity'] > 0 ? 'in' : ($validated['quantity'] < 0 ? 'out' : 'adjustment');
        $quantity = abs($validated['quantity']);
        
        if ($validated['quantity'] != 0) {
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity' => $quantity,
                'before_quantity' => $beforeStock,
                'after_quantity' => $newStock,
                'notes' => $validated['reason'],
                'user_id' => $user->id,
                'outlet_id' => $validated['outlet_id'] ?? $product->outlet_id,
            ]);
        }
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'stock_adjustment',
            'model_type' => 'App\Models\Product',
            'model_id' => $product->id,
            'description' => "Adjusted stock for product: {$product->name} from {$beforeStock} to {$newStock}. Reason: {$validated['reason']}",
            'data' => json_encode([
                'product_id' => $product->id,
                'before_quantity' => $beforeStock,
                'after_quantity' => $newStock,
                'adjustment_quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
            ]),
            'outlet_id' => $validated['outlet_id'] ?? $product->outlet_id,
        ]);
        
        // Return the movement if it exists, otherwise return a success message
        if (isset($movement)) {
            return ApiResponse::success([
                'id' => $movement->id,
                'product_id' => $movement->product_id,
                'quantity' => $movement->quantity,
                'before_quantity' => $movement->before_quantity,
                'after_quantity' => $movement->after_quantity,
                'movement_type' => $movement->type,
                'reference' => $movement->reference ?? '',
                'notes' => $movement->notes,
                'created_at' => $movement->created_at,
            ], 'Stock adjustment created successfully');
        }
        
        return ApiResponse::success([
            'message' => 'Stock adjustment created successfully (no movement recorded as stock did not change)',
        ], 'Stock adjustment created successfully');
    }
}