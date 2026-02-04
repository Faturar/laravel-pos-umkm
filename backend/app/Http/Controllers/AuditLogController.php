<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query();
        
        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->input('action'));
        }
        
        // Filter by user ID
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }
        
        // Filter by model type
        if ($request->has('model_type')) {
            $query->where('model_type', $request->input('model_type'));
        }
        
        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }
        
        // Also check for 'from' and 'to' parameters
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }
        
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }
        
        // Filter by outlet
        if ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        } else {
            // Filter by current user's outlet if not specified
            $user = \Illuminate\Support\Facades\Auth::user();
            if ($user && $user->outlet_id) {
                $query->where('outlet_id', $user->outlet_id);
            }
        }
        
        // Order by latest first
        $query->orderBy('created_at', 'desc');
        
        // Pagination
        $limit = $request->input('limit', $request->input('per_page', 20));
        $auditLogs = $query->with('user')->paginate($limit);
        
        // Return the data in the expected format
        return ApiResponse::paginated($auditLogs, 'Audit logs retrieved successfully');
    }
}