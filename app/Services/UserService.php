<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserService
{
    /**
     * Get all users with pagination.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllUsers(int $perPage = 15)
    {
        return User::with('roles.permissions')
            ->select('id', 'name', 'email', 'status', 'last_login_at', 'created_at')
            ->paginate($perPage);
    }

    /**
     * Get user by ID.
     *
     * @param int $id
     * @return User
     * @throws ModelNotFoundException
     */
    public function getUserById(int $id): User
    {
        return User::with('roles.permissions')->findOrFail($id);
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function createUser(array $data): User
    {
        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'status' => $data['status'] ?? 'active',
            ]);

            // Assign roles if provided
            if (isset($data['roles']) && is_array($data['roles'])) {
                $roleIds = Role::whereIn('name', $data['roles'])->pluck('id');
                if ($roleIds->isNotEmpty()) {
                    $user->roles()->attach($roleIds);
                }
            }

            DB::commit();

            // Load relationships
            $user->load('roles.permissions');

            return $user;

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Update user.
     *
     * @param int $id
     * @param array $data
     * @return User
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function updateUser(int $id, array $data): User
    {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($id);

            // Update user data
            $updateData = [
                'name' => $data['name'] ?? $user->name,
                'email' => $data['email'] ?? $user->email,
                'status' => $data['status'] ?? $user->status,
            ];

            // Update password if provided
            if (isset($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            $user->update($updateData);

            // Update roles if provided
            if (isset($data['roles']) && is_array($data['roles'])) {
                $roleIds = Role::whereIn('name', $data['roles'])->pluck('id');
                $user->roles()->sync($roleIds);
            }

            DB::commit();

            // Load relationships
            $user->load('roles.permissions');

            return $user;

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Update user status.
     *
     * @param int $id
     * @param string $status
     * @return User
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function updateUserStatus(int $id, string $status): User
    {
        $user = User::findOrFail($id);
        
        if (!in_array($status, ['active', 'suspended'])) {
            throw new \Exception('Invalid status value');
        }

        $user->update(['status' => $status]);
        
        return $user->fresh();
    }

    /**
     * Assign roles to user.
     *
     * @param int $id
     * @param array $roles
     * @return User
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function assignRoles(int $id, array $roles): User
    {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($id);
            
            $roleIds = Role::whereIn('name', $roles)->pluck('id');
            
            if ($roleIds->isEmpty()) {
                throw new \Exception('No valid roles found');
            }

            $user->roles()->sync($roleIds);

            DB::commit();

            return $user->load('roles.permissions');

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to assign roles: ' . $e->getMessage());
        }
    }

    /**
     * Delete user (soft delete by setting status to suspended).
     *
     * @param int $id
     * @return bool
     * @throws ModelNotFoundException
     * @throws \Exception
     */
    public function deleteUser(int $id): bool
    {
        $user = User::findOrFail($id);
        
        // Instead of deleting, we suspend the user as per requirements
        return $user->update(['status' => 'suspended']);
    }

    /**
     * Get current authenticated user.
     *
     * @return User
     * @throws AuthenticationException
     */
    public function getCurrentUser(): User
    {
        $user = auth()->user();
        
        if (!$user) {
            throw new AuthenticationException('User not authenticated');
        }

        return $user->load('roles.permissions');
    }
}