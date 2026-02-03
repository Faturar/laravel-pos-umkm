<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleService
{
    /**
     * Get all roles with permissions.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllRoles(int $perPage = 15)
    {
        return Role::with('permissions')
            ->select('id', 'name', 'label', 'description', 'created_at')
            ->paginate($perPage);
    }

    /**
     * Get role by ID.
     *
     * @param int $id
     * @return Role
     * @throws ModelNotFoundException
     */
    public function getRoleById(int $id): Role
    {
        return Role::with('permissions')->findOrFail($id);
    }

    /**
     * Create a new role.
     *
     * @param array $data
     * @return Role
     * @throws \Exception
     */
    public function createRole(array $data): Role
    {
        try {
            DB::beginTransaction();

            // Create role
            $role = Role::create([
                'name' => $data['name'],
                'label' => $data['label'],
                'description' => $data['description'] ?? null,
            ]);

            // Assign permissions if provided
            if (isset($data['permissions']) && is_array($data['permissions'])) {
                $permissionIds = Permission::whereIn('name', $data['permissions'])->pluck('id');
                if ($permissionIds->isNotEmpty()) {
                    $role->permissions()->attach($permissionIds);
                }
            }

            DB::commit();

            // Load relationships
            $role->load('permissions');

            return $role;

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to create role: ' . $e->getMessage());
        }
    }

    /**
     * Update role.
     *
     * @param int $id
     * @param array $data
     * @return Role
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function updateRole(int $id, array $data): Role
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);

            // Update role data
            $updateData = [
                'name' => $data['name'] ?? $role->name,
                'label' => $data['label'] ?? $role->label,
                'description' => $data['description'] ?? $role->description,
            ];

            $role->update($updateData);

            // Update permissions if provided
            if (isset($data['permissions']) && is_array($data['permissions'])) {
                $permissionIds = Permission::whereIn('name', $data['permissions'])->pluck('id');
                $role->permissions()->sync($permissionIds);
            }

            DB::commit();

            // Load relationships
            $role->load('permissions');

            return $role;

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to update role: ' . $e->getMessage());
        }
    }

    /**
     * Delete role.
     *
     * @param int $id
     * @return bool
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function deleteRole(int $id): bool
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);

            // Check if role has users
            if ($role->users()->count() > 0) {
                throw new \Exception('Cannot delete role that has assigned users');
            }

            // Detach all permissions
            $role->permissions()->detach();

            // Delete role
            $role->delete();

            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to delete role: ' . $e->getMessage());
        }
    }

    /**
     * Assign permissions to role.
     *
     * @param int $id
     * @param array $permissions
     * @return Role
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function assignPermissions(int $id, array $permissions): Role
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);
            
            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
            
            if ($permissionIds->isEmpty()) {
                throw new \Exception('No valid permissions found');
            }

            $role->permissions()->sync($permissionIds);

            DB::commit();

            return $role->load('permissions');

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to assign permissions: ' . $e->getMessage());
        }
    }

    /**
     * Get all permissions grouped by group name.
     *
     * @return array
     */
    public function getAllPermissionsGrouped(): array
    {
        return Permission::getGrouped();
    }

    /**
     * Check if role has specific permission.
     *
     * @param int $roleId
     * @param string $permission
     * @return bool
     * @throws ModelNotFoundException
     */
    public function roleHasPermission(int $roleId, string $permission): bool
    {
        $role = Role::findOrFail($roleId);
        return $role->hasPermission($permission);
    }

    /**
     * Sync permissions for role (replace all existing permissions).
     *
     * @param int $id
     * @param array $permissions
     * @return Role
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function syncPermissions(int $id, array $permissions): Role
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);
            
            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
            
            $role->permissions()->sync($permissionIds);

            DB::commit();

            return $role->load('permissions');

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to sync permissions: ' . $e->getMessage());
        }
    }

    /**
     * Revoke permissions from role.
     *
     * @param int $id
     * @param array $permissions
     * @return Role
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function revokePermissions(int $id, array $permissions): Role
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);
            
            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
            
            if ($permissionIds->isEmpty()) {
                throw new \Exception('No valid permissions found');
            }

            $role->permissions()->detach($permissionIds);

            DB::commit();

            return $role->load('permissions');

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to revoke permissions: ' . $e->getMessage());
        }
    }
}