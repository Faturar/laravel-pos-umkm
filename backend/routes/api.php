<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RefreshTokenController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ComboController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::post('/auth/login', [LoginController::class, 'login']);
Route::post('/auth/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Protected routes (JWT authentication required)
Route::group(['middleware' => [\App\Http\Middleware\JwtAuthenticate::class]], function () {
    
    // Auth routes
    Route::post('/auth/refresh', [RefreshTokenController::class, 'refresh']);
    Route::post('/auth/logout', [RefreshTokenController::class, 'logout']);
    
    // Current user info
    Route::get('/me', [UserController::class, 'me']);
    
    // User management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_users']], function () {
        Route::get('/users', [UserController::class, 'index']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_users']], function () {
        Route::post('/users', [UserController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_users']], function () {
        Route::put('/users/{id}', [UserController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':manage_users']], function () {
        Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
        Route::post('/users/{id}/roles', [UserController::class, 'assignRoles']);
    });
    
    // Role management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_roles']], function () {
        Route::get('/roles', [RoleController::class, 'index']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_roles']], function () {
        Route::post('/roles', [RoleController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_roles']], function () {
        Route::put('/roles/{id}', [RoleController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':manage_roles']], function () {
        Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
    });
    
    // Permission routes (read-only in production)
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_permissions']], function () {
        Route::get('/permissions', [PermissionController::class, 'index']);
    });
    
    // Category management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_categories']], function () {
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{id}', [CategoryController::class, 'show']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_categories']], function () {
        Route::post('/categories', [CategoryController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_categories']], function () {
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':delete_categories']], function () {
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });
    
    // Product management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_products']], function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/search', [ProductController::class, 'search']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_products']], function () {
        Route::post('/products', [ProductController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_products']], function () {
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::patch('/products/{id}/stock', [ProductController::class, 'updateStock']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':delete_products']], function () {
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });
    
    // Combo management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_products']], function () {
        Route::get('/combos', [ComboController::class, 'index']);
        Route::get('/combos/{id}', [ComboController::class, 'show']);
        Route::get('/combos/{id}/check-stock', [ComboController::class, 'checkStock']);
        Route::get('/combos/outlet/{outletId}/active', [ComboController::class, 'getActiveCombosByOutlet']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_products']], function () {
        Route::post('/combos', [ComboController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_products']], function () {
        Route::put('/combos/{id}', [ComboController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':delete_products']], function () {
        Route::delete('/combos/{id}', [ComboController::class, 'destroy']);
    });
    
    // Product Variant management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_products']], function () {
        Route::post('/products/{id}/variants', [ProductVariantController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_products']], function () {
        Route::put('/variants/{id}', [ProductVariantController::class, 'update']);
        Route::patch('/variants/{id}/stock', [ProductVariantController::class, 'updateStock']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':delete_products']], function () {
        Route::delete('/variants/{id}', [ProductVariantController::class, 'destroy']);
    });
    
    // Transaction management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_transactions']], function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/daily-summary', [TransactionController::class, 'dailySummary']);
        Route::get('/transactions/statistics', [TransactionController::class, 'statistics']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        Route::get('/receipts/{id}', [TransactionController::class, 'generateReceipt']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_transactions']], function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_transactions']], function () {
        Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':void_transactions']], function () {
        Route::post('/transactions/{id}/void', [TransactionController::class, 'void']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':refund_transactions']], function () {
        Route::post('/transactions/{id}/refund', [TransactionController::class, 'refund']);
    });
    
    // Sync routes (for offline mode)
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':sync_data']], function () {
        Route::post('/sync/transactions', [SyncController::class, 'pushTransactions']);
        Route::get('/sync/products', [SyncController::class, 'pullProducts']);
        Route::get('/sync/categories', [SyncController::class, 'pullCategories']);
        Route::get('/sync/combos', [SyncController::class, 'pullCombos']);
        Route::get('/sync/settings', [SyncController::class, 'pullSettings']);
        Route::get('/sync/status', [SyncController::class, 'syncStatus']);
    });
    
    // Report routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_reports']], function () {
        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/products', [ReportController::class, 'products']);
        Route::get('/reports/payments', [ReportController::class, 'payments']);
        Route::get('/reports/cash', [ReportController::class, 'cash']);
        Route::get('/reports/inventory', [ReportController::class, 'inventory']);
        Route::get('/reports/combos', [ReportController::class, 'combos']);
        Route::get('/reports/combos/items', [ReportController::class, 'comboItems']);
    });
    
    // Stock management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_stock']], function () {
        Route::get('/stocks', [StockController::class, 'index']);
        Route::get('/stocks/movements', [StockController::class, 'movements']);
        Route::get('/stocks/summary', [StockController::class, 'summary']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':manage_stock']], function () {
        Route::post('/stocks/in', [StockController::class, 'stockIn']);
        Route::post('/stocks/adjust', [StockController::class, 'adjust']);
    });
    
    // Outlet management routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_outlets']], function () {
        Route::get('/outlets', [OutletController::class, 'index']);
        Route::get('/outlets/{id}', [OutletController::class, 'show']);
        Route::get('/outlets/{id}/statistics', [OutletController::class, 'statistics']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':create_outlets']], function () {
        Route::post('/outlets', [OutletController::class, 'store']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':edit_outlets']], function () {
        Route::put('/outlets/{id}', [OutletController::class, 'update']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':delete_outlets']], function () {
        Route::delete('/outlets/{id}', [OutletController::class, 'destroy']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':switch_outlets']], function () {
        Route::post('/outlets/switch', [OutletController::class, 'switch']);
    });
    
    // Audit Log routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_audit_logs']], function () {
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });
    
    // Settings routes
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':view_settings']], function () {
        Route::get('/settings', [SettingController::class, 'index']);
        Route::get('/settings/pos', [SettingController::class, 'getPosSettings']);
        Route::get('/settings/group/{group}', [SettingController::class, 'getByGroup']);
        Route::get('/settings/{id}', [SettingController::class, 'show']);
    });
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':manage_settings']], function () {
        Route::put('/settings/{id}', [SettingController::class, 'update']);
        Route::post('/settings/bulk-update', [SettingController::class, 'bulkUpdate']);
        Route::post('/settings/{id}/reset', [SettingController::class, 'reset']);
    });
    
    // Health & Security routes
    Route::get('/health', [HealthController::class, 'index']);
    
    Route::group(['middleware' => [\App\Http\Middleware\CheckPermission::class . ':manage_system']], function () {
        Route::post('/backup', [HealthController::class, 'backup']);
        Route::get('/backup/history', [HealthController::class, 'backupHistory']);
        Route::get('/backup/download/{filename}', [HealthController::class, 'downloadBackup']);
    });
});