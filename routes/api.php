<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RefreshTokenController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

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
});