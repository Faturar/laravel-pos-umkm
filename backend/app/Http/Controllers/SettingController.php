<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    /**
     * Display a listing of settings.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();
        
        // Filter by outlet
        if ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        } else {
            // If no outlet specified, get global settings (outlet_id = null)
            $query->whereNull('outlet_id');
        }
        
        // Filter by key
        if ($request->has('key')) {
            $query->where('key', $request->input('key'));
        }
        
        $settings = $query->get();
        
        // Convert to key-value pairs
        $settingsArray = [];
        foreach ($settings as $setting) {
            $value = $setting->value;
            
            // Decode JSON values
            if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $value = $decoded;
                }
            }
            
            $settingsArray[$setting->key] = $value;
        }
        
        return ApiResponse::success($settingsArray, 'Settings retrieved successfully');
    }
    
    /**
     * Display the specified setting.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $setting = Setting::findOrFail($id);
        
        // Decode JSON values
        $value = $setting->value;
        if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }
        
        $setting->value = $value;
        
        return ApiResponse::success($setting, 'Setting retrieved successfully');
    }
    
    /**
     * Get settings by group.
     *
     * @param string $group
     * @param Request $request
     * @return JsonResponse
     */
    public function getByGroup(string $group, Request $request): JsonResponse
    {
        $query = Setting::where('group', $group);
        
        // Filter by outlet
        if ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->input('outlet_id'));
        } else {
            // If no outlet specified, get global settings (outlet_id = null)
            $query->whereNull('outlet_id');
        }
        
        $settings = $query->get();
        
        // Convert to key-value pairs
        $settingsArray = [];
        foreach ($settings as $setting) {
            $value = $setting->value;
            
            // Decode JSON values
            if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $value = $decoded;
                }
            }
            
            $settingsArray[$setting->key] = $value;
        }
        
        return ApiResponse::success($settingsArray, "Settings for group '{$group}' retrieved successfully");
    }
    
    /**
     * Get POS settings.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getPosSettings(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Get POS-related settings from multiple groups
        $generalSettings = Setting::getSettings('general', $outletId);
        $receiptSettings = Setting::getSettings('receipt', $outletId);
        $paymentSettings = Setting::getSettings('payment', $outletId);
        $taxSettings = Setting::getSettings('tax', $outletId);
        
        $posSettings = [
            'general' => $generalSettings,
            'receipt' => $receiptSettings,
            'payment' => $paymentSettings,
            'tax' => $taxSettings,
        ];
        
        return ApiResponse::success($posSettings, 'POS settings retrieved successfully');
    }
    
    /**
     * Update the specified setting.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $setting = Setting::findOrFail($id);
        
        // Non-admin/owner can only update settings for their own outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $setting->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You can only update settings for your own outlet'], 403);
        }
        
        $validated = $request->validate([
            'value' => 'required|string',
        ]);
        
        // If value is an array or object, encode it as JSON
        if (is_array($validated['value']) || is_object($validated['value'])) {
            $validated['value'] = json_encode($validated['value']);
        }
        
        $setting->value = $validated['value'];
        $setting->updated_by = $user->id;
        $setting->save();
        
        // Decode JSON values for response
        $value = $setting->value;
        if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }
        
        $setting->value = $value;
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'update_setting',
            'model_type' => 'App\Models\Setting',
            'model_id' => $setting->id,
            'description' => "Updated setting: {$setting->key}",
            'data' => json_encode($validated),
            'outlet_id' => $setting->outlet_id,
        ]);
        
        return ApiResponse::success($setting, 'Setting updated successfully');
    }
    
    /**
     * Update multiple settings.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $user = Auth::user();
        $outletId = $request->input('outlet_id', $user->outlet_id);
        
        // Non-admin/owner can only update settings for their own outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $outletId !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You can only update settings for your own outlet'], 403);
        }
        
        $settings = $request->input('settings', $request->all());
        
        // Remove outlet_id from settings array if present
        unset($settings['outlet_id']);
        
        $updatedSettings = [];
        
        foreach ($settings as $settingData) {
            // If value is an array or object, encode it as JSON
            $value = $settingData['value'];
            if (is_array($value) || is_object($value)) {
                $value = json_encode($value);
            }
            
            // Update or create setting
            $setting = Setting::findOrFail($settingData['id']);
            $setting->value = $value;
            $setting->updated_by = $user->id;
            $setting->save();
            
            $updatedSettings[] = $setting;
        }
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'bulk_update_settings',
            'model_type' => 'App\Models\Setting',
            'description' => "Bulk updated settings for outlet: {$outletId}",
            'data' => json_encode($settings),
            'outlet_id' => $outletId,
        ]);
        
        // Include all fields in the response
        $settingsResponse = [];
        foreach ($updatedSettings as $setting) {
            $settingsResponse[] = [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'group' => $setting->group,
                'description' => $setting->description,
                'outlet_id' => $setting->outlet_id,
                'created_at' => $setting->created_at,
                'updated_at' => $setting->updated_at,
                'updated_by' => $setting->updated_by,
            ];
        }
        
        return ApiResponse::success($settingsResponse, 'Settings updated successfully');
    }
    
    /**
     * Reset the specified setting to default.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function reset(int $id): JsonResponse
    {
        $user = Auth::user();
        $setting = Setting::findOrFail($id);
        
        // Non-admin/owner can only reset settings for their own outlet
        if (!$user->hasRole('admin') && !$user->hasRole('owner') && $setting->outlet_id !== $user->outlet_id) {
            return ApiResponse::error('Unauthorized', ['message' => 'You can only reset settings for your own outlet'], 403);
        }
        
        // Get default value based on setting key
        $defaultValue = $this->getDefaultValue($setting->key);
        
        $setting->value = $defaultValue;
        $setting->updated_by = $user->id;
        $setting->save();
        
        // Decode JSON values for response
        $value = $setting->value;
        if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }
        
        $setting->value = $value;
        
        // Log audit
        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => 'reset_setting',
            'model_type' => 'App\Models\Setting',
            'model_id' => $setting->id,
            'description' => "Reset setting to default: {$setting->key}",
            'data' => json_encode(['default_value' => $defaultValue]),
            'outlet_id' => $setting->outlet_id,
        ]);
        
        return ApiResponse::success($setting, 'Setting reset to default successfully');
    }
    
    /**
     * Get default value for a setting key.
     *
     * @param string $key
     * @return string
     */
    private function getDefaultValue(string $key): string
    {
        $defaults = [
            'tax_rate' => '0',
            'tax_percentage' => '11',
            'service_charge_rate' => '0',
            'service_charge_percentage' => '5',
            'receipt_header' => '',
            'receipt_footer' => 'Thank you for your purchase!',
            'currency' => 'IDR',
            'decimal_places' => '0',
            'low_stock_threshold' => '10',
            'auto_backup' => 'false',
            'backup_frequency' => 'daily',
            'printer_type' => 'thermal',
            'receipt_width' => '58',
            'cash_drawer_open_code' => '27,112,0,25,250',
            'offline_mode' => 'false',
            'sync_interval' => '5',
        ];
        
        return $defaults[$key] ?? '';
    }
}