<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Auth\AuthenticationException;

class LoginService
{
    /**
     * Execute user login process.
     *
     * @param array $credentials
     * @return array
     * @throws AuthenticationException
     */
    public function execute(array $credentials): array
    {
        // Find user by email
        $user = User::where('email', $credentials['email'])->first();
        
        if (!$user) {
            throw new AuthenticationException('Invalid credentials');
        }

        // Check if user is active
        if (!$user->isActive()) {
            throw new AuthenticationException('Account suspended');
        }

        // Attempt to authenticate
        if (!Auth::attempt($credentials)) {
            throw new AuthenticationException('Invalid credentials');
        }

        try {
            // Generate JWT token
            $token = JWTAuth::fromUser($user);
            
            if (!$token) {
                throw new AuthenticationException('Could not create token');
            }

            // Update last login time
            $user->last_login_at = now();
            $user->save();

            // Load user with roles and permissions
            $user->load('roles.permissions');

            // Prepare response data
            return [
                'token' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60
                ],
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                    'roles' => $user->getAllRoles(),
                    'permissions' => $user->getAllPermissions()
                ]
            ];

        } catch (JWTException $e) {
            throw new AuthenticationException('Could not create token: ' . $e->getMessage());
        }
    }
}