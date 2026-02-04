<?php

namespace App\Http\Controllers;

use App\Models\Outlet;
use App\Models\Transaction;
use App\Models\Product;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OutletController extends Controller
{
    /**
     * Display a listing of outlets.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Outlet::query();
        
        // Non-admin/owner can only see their own outlet
        if (!$user->hasRole(['admin', 'owner'])) {
            $query->where('id', $user->outlet_id);
        }
        
        // Search by name or code
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
        
        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active'));
        }
        
        $outlets = $query->get();
        
        return ApiResponse::success($outlets, 'Outlets retrieved successfully');
    }
    
    /**
     * Display the specified outlet.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();
        
        // Non-admin/owner can only see their own outlet
        if (!$user->hasRole(['admin', 'owner']) && $user->outlet_id !== $id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this outlet'], 403);
        }
        
        $outlet = Outlet::findOrFail($id);
        
        return ApiResponse::success($outlet, 'Outlet retrieved successfully');
    }
    
    /**
     * Get outlet statistics.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function statistics(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();
        
        // Non-admin/owner can only see their own outlet statistics
        if (!$user->hasRole(['admin', 'owner']) && $user->outlet_id !== $id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this outlet'], 403);
        }
        
        $outlet = Outlet::findOrFail($id);
        
        // Get today's transaction count and total sales
        $today = now()->format('Y-m-d');
        $todayTransactions = Transaction::where('outlet_id', $id)
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->count();
        
        $todaySales = Transaction::where('outlet_id', $id)
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->sum('final_amount');
        
        // Get this month's transaction count and total sales
        $monthStart = now()->startOfMonth()->format('Y-m-d');
        $monthTransactions = Transaction::where('outlet_id', $id)
            ->whereDate('created_at', '>=', $monthStart)
            ->where('status', 'completed')
            ->count();
        
        $monthSales = Transaction::where('outlet_id', $id)
            ->whereDate('created_at', '>=', $monthStart)
            ->where('status', 'completed')
            ->sum('final_amount');
        
        // Get product count
        $productCount = Product::where('outlet_id', $id)->count();
        
        // Get low stock products count
        $lowStockCount = Product::where('outlet_id', $id)
            ->whereColumn('stock', '<=', 'min_stock')
            ->count();
        
        return ApiResponse::success([
            'outlet' => $outlet,
            'today' => [
                'transactions' => $todayTransactions,
                'sales' => $todaySales,
            ],
            'month' => [
                'transactions' => $monthTransactions,
                'sales' => $monthSales,
            ],
            'inventory' => [
                'total_products' => $productCount,
                'low_stock_products' => $lowStockCount,
            ],
        ], 'Outlet statistics retrieved successfully');
    }
    
    /**
     * Store a newly created outlet.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:outlets,code',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
        ]);
        
        $user = auth()->user();
        
        // Only admin/owner can create outlets
        if (!$user->hasRole(['admin', 'owner'])) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have permission to create outlets'], 403);
        }
        
        $outlet = Outlet::create($validated);
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'create_outlet',
            'model_type' => 'App\Models\Outlet',
            'model_id' => $outlet->id,
            'description' => "Created new outlet: {$outlet->name}",
            'data' => json_encode($validated),
        ]);
        
        return ApiResponse::success($outlet, 'Outlet created successfully', 201);
    }
    
    /**
     * Update the specified outlet.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:outlets,code,' . $id,
            'address' => 'sometimes|required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
        ]);
        
        $user = auth()->user();
        $outlet = Outlet::findOrFail($id);
        
        // Only admin/owner can update outlets
        if (!$user->hasRole(['admin', 'owner'])) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have permission to update outlets'], 403);
        }
        
        $outlet->update($validated);
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'update_outlet',
            'model_type' => 'App\Models\Outlet',
            'model_id' => $outlet->id,
            'description' => "Updated outlet: {$outlet->name}",
            'data' => json_encode($validated),
        ]);
        
        return ApiResponse::success($outlet, 'Outlet updated successfully');
    }
    
    /**
     * Remove the specified outlet.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $outlet = Outlet::findOrFail($id);
        
        // Only admin/owner can delete outlets
        if (!$user->hasRole(['admin', 'owner'])) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have permission to delete outlets'], 403);
        }
        
        // Check if outlet has transactions
        $transactionCount = Transaction::where('outlet_id', $id)->count();
        if ($transactionCount > 0) {
            return ApiResponse::error('Cannot delete outlet', [
                'message' => 'This outlet has transactions and cannot be deleted',
                'transaction_count' => $transactionCount,
            ], 400);
        }
        
        // Check if outlet has products
        $productCount = Product::where('outlet_id', $id)->count();
        if ($productCount > 0) {
            return ApiResponse::error('Cannot delete outlet', [
                'message' => 'This outlet has products and cannot be deleted',
                'product_count' => $productCount,
            ], 400);
        }
        
        $outletName = $outlet->name;
        $outlet->delete();
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'delete_outlet',
            'model_type' => 'App\Models\Outlet',
            'description' => "Deleted outlet: {$outletName}",
        ]);
        
        return ApiResponse::success(null, 'Outlet deleted successfully');
    }
    
    /**
     * Switch to another outlet.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function switch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'outlet_id' => 'required|exists:outlets,id',
        ]);
        
        $user = auth()->user();
        $outlet = Outlet::findOrFail($validated['outlet_id']);
        
        // Check if outlet is active
        if (!$outlet->is_active) {
            return ApiResponse::error('Cannot switch outlet', ['message' => 'This outlet is not active'], 400);
        }
        
        // Check if user has access to this outlet
        if (!$user->hasRole(['admin', 'owner']) && $user->outlet_id !== $outlet->id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You do not have access to this outlet'], 403);
        }
        
        // Update user's current outlet
        $user->current_outlet_id = $outlet->id;
        $user->save();
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'switch_outlet',
            'model_type' => 'App\Models\Outlet',
            'model_id' => $outlet->id,
            'description' => "Switched to outlet: {$outlet->name}",
        ]);
        
        return ApiResponse::success([
            'outlet' => $outlet,
            'user' => $user,
        ], 'Outlet switched successfully');
    }
}