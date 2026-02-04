<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        // Get authenticated user from the request (set by JwtAuthenticate middleware)
        $user = $request->auth_user;

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'errors' => ['auth' => 'User not authenticated']
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Check if user has the required permission
        // Support multiple permissions separated by comma
        $permissions = explode(',', $permission);
        $hasPermission = false;

        foreach ($permissions as $perm) {
            if ($user->hasPermission(trim($perm))) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions',
                'errors' => ['permission' => 'You do not have permission to access this resource']
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}