<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Check if token exists in the request
            if (!$token = JWTAuth::getToken()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided',
                    'errors' => ['token' => 'Authorization token is required']
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Attempt to parse the token and authenticate the user
            if (!$user = JWTAuth::authenticate($token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                    'errors' => ['user' => 'User not found for provided token']
                ], Response::HTTP_NOT_FOUND);
            }

            // Check if user is active
            if (!$user->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account suspended',
                    'errors' => ['status' => 'User account is suspended']
                ], Response::HTTP_FORBIDDEN);
            }

            // Update last login time
            $user->last_login_at = now();
            $user->save();

            // Attach user to the request for further use
            $request->merge(['auth_user' => $user]);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token expired',
                'errors' => ['token' => 'Token has expired']
            ], Response::HTTP_UNAUTHORIZED);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token',
                'errors' => ['token' => 'Token is invalid']
            ], Response::HTTP_UNAUTHORIZED);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token error',
                'errors' => ['token' => 'Error occurred while processing token']
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}