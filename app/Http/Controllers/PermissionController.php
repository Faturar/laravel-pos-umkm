<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use App\Support\Response\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PermissionController extends Controller
{
    /**
     * Get all permissions.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $permissions = Permission::orderBy('group')->orderBy('name')->get();
            
            return ApiResponse::success(PermissionResource::collection($permissions), 'Permissions retrieved successfully');
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve permissions', ['permissions' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all permissions grouped by group name.
     *
     * @return JsonResponse
     */
    public function grouped(): JsonResponse
    {
        try {
            $permissions = Permission::getGrouped();
            
            return ApiResponse::success($permissions, 'Grouped permissions retrieved successfully');
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve grouped permissions', ['permissions' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a specific permission.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $permission = Permission::findOrFail($id);
            
            return ApiResponse::success(new PermissionResource($permission), 'Permission retrieved successfully');
            
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Permission not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve permission', ['permission' => $e->getMessage()], 404);
        }
    }
}