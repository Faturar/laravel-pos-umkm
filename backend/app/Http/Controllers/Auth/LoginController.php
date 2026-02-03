<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\LoginService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\AuthenticationException;

class LoginController extends Controller
{
    protected $loginService;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    /**
     * Handle user login request.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginService->execute($request->validated());
            
            return ApiResponse::jwtToken(
                $result['token']['access_token'],
                $result['token']['expires_in'],
                $result['user'],
                'Login success'
            );
            
        } catch (AuthenticationException $e) {
            return ApiResponse::unauthorized($e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Login failed', ['login' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }
}