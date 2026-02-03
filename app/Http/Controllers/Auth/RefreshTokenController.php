<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\TokenService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;

class RefreshTokenController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * Refresh JWT token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $newToken = $this->tokenService->refresh();
            $expiresIn = config('jwt.ttl') * 60; // Get JWT TTL from config
            
            return ApiResponse::success([
                'access_token' => $newToken,
                'token_type' => 'Bearer',
                'expires_in' => $expiresIn
            ], 'Token refreshed successfully');
            
        } catch (JWTException $e) {
            return ApiResponse::unauthorized('Token refresh failed: ' . $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Token refresh failed', ['token' => $e->getMessage()], $e->getCode() ?: 401);
        }
    }

    /**
     * Logout user (invalidate token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->tokenService->invalidate();
            
            return ApiResponse::success(null, 'Logged out successfully');
            
        } catch (JWTException $e) {
            return ApiResponse::error('Logout failed', ['logout' => $e->getMessage()], $e->getCode() ?: 400);
        } catch (\Exception $e) {
            return ApiResponse::error('Logout failed', ['logout' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}