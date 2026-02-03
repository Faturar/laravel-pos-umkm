<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get current authenticated user.
     *
     * @return JsonResponse
     */
    public function me(): JsonResponse
    {
        try {
            $user = $this->userService->getCurrentUser();
            
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at ? $user->last_login_at->toISOString() : null,
                'roles' => $user->getAllRoles(),
                'permissions' => $user->getAllPermissions()
            ];
            
            return ApiResponse::success($userData, 'Current user retrieved successfully');
            
        } catch (\Exception $e) {
            return ApiResponse::unauthorized('Failed to retrieve current user: ' . $e->getMessage());
        }
    }

    /**
     * Get all users.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $users = $this->userService->getAllUsers();
            
            return ApiResponse::resourceCollection(
                UserResource::collection($users),
                'Users retrieved successfully'
            );
            
        } catch (\Exception $e) {
            return ApiResponse::serverError('Failed to retrieve users: ' . $e->getMessage());
        }
    }

    /**
     * Create a new user.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());
            
            return ApiResponse::created(
                new UserResource($user),
                'User created successfully'
            );
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create user', ['user' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Get a specific user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            
            return ApiResponse::success(
                new UserResource($user),
                'User retrieved successfully'
            );
            
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('User not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve user', ['user' => $e->getMessage()], 404);
        }
    }

    /**
     * Update a user.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
                'status' => 'sometimes|required|in:active,suspended',
                'roles' => 'sometimes|array',
                'roles.*' => 'string|exists:roles,name'
            ]);

            $user = $this->userService->updateUser($id, $validated);
            
            return (new UserResource($user))->response();
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'errors' => ['user' => $e->getMessage()]
            ], $e->getCode() ?: 400);
        }
    }

    /**
     * Update user status.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:active,suspended'
            ]);

            $user = $this->userService->updateUserStatus($id, $validated['status']);
            
            return ApiResponse::success([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status
            ], 'User status updated successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('User not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update user status', ['user' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * Assign roles to user.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function assignRoles(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'roles' => 'required|array',
                'roles.*' => 'required|string|exists:roles,name'
            ]);

            $user = $this->userService->assignRoles($id, $validated['roles']);
            
            return ApiResponse::success([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getAllRoles(),
                'permissions' => $user->getAllPermissions()
            ], 'Roles assigned successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (ModelNotFoundException $e) {
            return ApiResponse::notFound('User not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to assign roles', ['user' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}