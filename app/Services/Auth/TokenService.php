<?php

namespace App\Services\Auth;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Illuminate\Auth\AuthenticationException;

class TokenService
{
    /**
     * Refresh the JWT token.
     *
     * @return string
     * @throws AuthenticationException
     */
    public function refresh(): string
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            
            if (!$token) {
                throw new AuthenticationException('Could not refresh token');
            }
            
            return $token;
            
        } catch (TokenExpiredException $e) {
            throw new AuthenticationException('Token has expired and can no longer be refreshed');
        } catch (TokenInvalidException $e) {
            throw new AuthenticationException('Token is invalid');
        } catch (JWTException $e) {
            throw new AuthenticationException('Error while refreshing token: ' . $e->getMessage());
        }
    }

    /**
     * Invalidate the current token (logout).
     *
     * @return bool
     * @throws AuthenticationException
     */
    public function invalidate(): bool
    {
        try {
            $token = JWTAuth::parseToken();
            
            if (!$token) {
                throw new AuthenticationException('No token provided');
            }
            
            JWTAuth::invalidate($token);
            
            return true;
            
        } catch (TokenExpiredException $e) {
            throw new AuthenticationException('Token has expired');
        } catch (TokenInvalidException $e) {
            throw new AuthenticationException('Token is invalid');
        } catch (JWTException $e) {
            throw new AuthenticationException('Error while invalidating token: ' . $e->getMessage());
        }
    }

    /**
     * Get the authenticated user from the token.
     *
     * @return \App\Models\User
     * @throws AuthenticationException
     */
    public function getUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                throw new AuthenticationException('User not found');
            }
            
            return $user;
            
        } catch (TokenExpiredException $e) {
            throw new AuthenticationException('Token has expired');
        } catch (TokenInvalidException $e) {
            throw new AuthenticationException('Token is invalid');
        } catch (JWTException $e) {
            throw new AuthenticationException('Error while authenticating user: ' . $e->getMessage());
        }
    }

    /**
     * Check if the token is valid.
     *
     * @return bool
     */
    public function isValid(): bool
    {
        try {
            JWTAuth::parseToken()->authenticate();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the token payload.
     *
     * @return array
     * @throws AuthenticationException
     */
    public function getPayload(): array
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();
            return $payload->toArray();
        } catch (JWTException $e) {
            throw new AuthenticationException('Error while getting token payload: ' . $e->getMessage());
        }
    }
}