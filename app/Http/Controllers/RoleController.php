<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Get all roles.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $roles = $this->roleService->getAllRoles();
            
            return ApiResponse::success('Roles retrieved successfully', RoleResource::collection($roles));
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve roles', ['roles' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new role.
     *
     * @param StoreRoleRequest $request
     * @return JsonResponse
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        try {
            $role = $this->roleService->createRole($request->validated());
            
            return ApiResponse::created(new RoleResource($role), 'Role created successfully');
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create role', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Get a specific role.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $role = $this->roleService->getRoleById($id);
            
            return ApiResponse::success(new RoleResource($role), 'Role retrieved successfully');
            
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve role', ['role' => $e->getMessage()], 404);
        }
    }

    /**
     * Update a role.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $id,
                'label' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string|max:500',
                'permissions' => 'sometimes|array',
                'permissions.*' => 'required|string|exists:permissions,name'
            ]);

            $role = $this->roleService->updateRole($id, $validated);
            
            return ApiResponse::success(new RoleResource($role), 'Role updated successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update role', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Delete a role.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->roleService->deleteRole($id);
            
            return ApiResponse::noContent('Role deleted successfully');
            
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to delete role', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Assign permissions to a role.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function assignPermissions(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'required|string|exists:permissions,name'
            ]);

            $role = $this->roleService->assignPermissions($id, $validated['permissions']);
            
            $data = [
                'id' => $role->id,
                'name' => $role->name,
                'label' => $role->label,
                'permissions' => $role->getAllPermissions()
            ];
            
            return ApiResponse::success($data, 'Permissions assigned successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to assign permissions', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Sync permissions for a role.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function syncPermissions(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'required|string|exists:permissions,name'
            ]);

            $role = $this->roleService->syncPermissions($id, $validated['permissions']);
            
            $data = [
                'id' => $role->id,
                'name' => $role->name,
                'label' => $role->label,
                'permissions' => $role->getAllPermissions()
            ];
            
            return ApiResponse::success($data, 'Permissions synced successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to sync permissions', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Revoke permissions from a role.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function revokePermissions(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'required|string|exists:permissions,name'
            ]);

            $role = $this->roleService->revokePermissions($id, $validated['permissions']);
            
            $data = [
                'id' => $role->id,
                'name' => $role->name,
                'label' => $role->label,
                'permissions' => $role->getAllPermissions()
            ];
            
            return ApiResponse::success($data, 'Permissions revoked successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('Role not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to revoke permissions', ['role' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}