<?php

namespace App\Support\Response;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ApiResponse
{
    /**
     * Success response.
     *
     * @param mixed $data
     * @param string $message
     * @param int $status
     * @param array $headers
     * @return JsonResponse
     */
    public static function success($data = null, string $message = 'Success', int $status = 200, array $headers = []): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if ($data !== null) {
            // Handle resource collections
            if ($data instanceof JsonResource && method_exists($data, 'resource') &&
                (is_array($data->resource) || $data->resource instanceof \Illuminate\Support\Collection)) {
                $response['data'] = json_decode($data->toJson(), true);
            } else {
                $response['data'] = $data;
            }
        }

        return response()->json($response, $status, $headers);
    }

    /**
     * Error response.
     *
     * @param string $message
     * @param array $errors
     * @param int $status
     * @param array $headers
     * @return JsonResponse
     */
    public static function error(string $message = 'Error', array $errors = [], int $status = 400, array $headers = []): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status, $headers);
    }

    /**
     * Validation error response.
     *
     * @param array $errors
     * @param string $message
     * @param array $headers
     * @return JsonResponse
     */
    public static function validationError(array $errors, string $message = 'Validation failed', array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 422, $headers);
    }

    /**
     * Unauthorized response.
     *
     * @param string $message
     * @param array $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function unauthorized(string $message = 'Unauthorized', array $errors = [], array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 401, $headers);
    }

    /**
     * Forbidden response.
     *
     * @param string $message
     * @param array $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function forbidden(string $message = 'Forbidden', array $errors = [], array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 403, $headers);
    }

    /**
     * Not found response.
     *
     * @param string $message
     * @param array $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function notFound(string $message = 'Resource not found', array $errors = [], array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 404, $headers);
    }

    /**
     * Server error response.
     *
     * @param string $message
     * @param array $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function serverError(string $message = 'Internal server error', array $errors = [], array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 500, $headers);
    }

    /**
     * Too many requests response.
     *
     * @param string $message
     * @param array $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function tooManyRequests(string $message = 'Too many requests', array $errors = [], array $headers = []): JsonResponse
    {
        return self::error($message, $errors, 429, $headers);
    }

    /**
     * Resource collection response.
     *
     * @param JsonResource $resource
     * @param string $message
     * @param int $status
     * @param array $headers
     * @return JsonResponse
     */
    public static function resourceCollection(JsonResource $resource, string $message = 'Resources retrieved successfully', int $status = 200, array $headers = []): JsonResponse
    {
        if ($resource->resource instanceof LengthAwarePaginator) {
            $pagination = [
                'total' => $resource->resource->total(),
                'per_page' => $resource->resource->perPage(),
                'current_page' => $resource->resource->currentPage(),
                'last_page' => $resource->resource->lastPage(),
                'from' => $resource->resource->firstItem(),
                'to' => $resource->resource->lastItem(),
            ];

            $response = [
                'success' => true,
                'message' => $message,
                'data' => $resource,
                'pagination' => $pagination,
            ];

            return response()->json($response, $status, $headers);
        }

        return self::success($resource, $message, $status, $headers);
    }

    /**
     * Created response.
     *
     * @param mixed $data
     * @param string $message
     * @param array $headers
     * @return JsonResponse
     */
    public static function created($data = null, string $message = 'Resource created successfully', array $headers = []): JsonResponse
    {
        return self::success($data, $message, 201, $headers);
    }

    /**
     * No content response.
     *
     * @param string $message
     * @param array $headers
     * @return JsonResponse
     */
    public static function noContent(string $message = 'No content', array $headers = []): JsonResponse
    {
        return self::success(null, $message, 204, $headers);
    }

    /**
     * Paginated response.
     *
     * @param LengthAwarePaginator $paginator
     * @param string $message
     * @param int $status
     * @param array $headers
     * @return JsonResponse
     */
    public static function paginated(LengthAwarePaginator $paginator, string $message = 'Resources retrieved successfully', int $status = 200, array $headers = []): JsonResponse
    {
        $pagination = [
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
            'path' => $paginator->path(),
        ];

        $response = [
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => $pagination,
        ];

        return response()->json($response, $status, $headers);
    }

    /**
     * JWT token response.
     *
     * @param string $token
     * @param int $expiresIn
     * @param mixed $user
     * @param string $message
     * @param array $headers
     * @return JsonResponse
     */
    public static function jwtToken(string $token, int $expiresIn, $user = null, string $message = 'Login successful', array $headers = []): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => [
                'token' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => $expiresIn,
                ],
            ],
        ];

        if ($user !== null) {
            $response['data']['user'] = $user;
        }

        return response()->json($response, 200, $headers);
    }
}