<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole(['admin', 'owner']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'outlet_id' => 'sometimes|nullable|exists:outlets,id',
            'tax_rate' => 'sometimes|numeric|min:0|max:100',
            'service_charge_rate' => 'sometimes|numeric|min:0|max:100',
            'currency' => 'sometimes|string|max:3',
            'receipt_header' => 'sometimes|nullable|string|max:500',
            'receipt_footer' => 'sometimes|nullable|string|max:500',
            'printer_type' => 'sometimes|string|in:thermal,inkjet,laser',
            'printer_width' => 'sometimes|integer|min:1',
            'auto_print_receipt' => 'sometimes|boolean',
            'open_cash_drawer' => 'sometimes|boolean',
            'low_stock_threshold' => 'sometimes|integer|min:0',
            'offline_mode' => 'sometimes|boolean',
            'auto_sync' => 'sometimes|boolean',
            'sync_interval' => 'sometimes|integer|min:1',
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'outlet_id.exists' => 'Selected outlet does not exist',
            'tax_rate.numeric' => 'Tax rate must be a number',
            'tax_rate.min' => 'Tax rate cannot be negative',
            'tax_rate.max' => 'Tax rate cannot exceed 100%',
            'service_charge_rate.numeric' => 'Service charge rate must be a number',
            'service_charge_rate.min' => 'Service charge rate cannot be negative',
            'service_charge_rate.max' => 'Service charge rate cannot exceed 100%',
            'currency.max' => 'Currency code cannot exceed 3 characters',
            'receipt_header.max' => 'Receipt header cannot exceed 500 characters',
            'receipt_footer.max' => 'Receipt footer cannot exceed 500 characters',
            'printer_type.in' => 'Printer type must be one of: thermal, inkjet, laser',
            'printer_width.integer' => 'Printer width must be a number',
            'printer_width.min' => 'Printer width must be at least 1',
            'auto_print_receipt.boolean' => 'Auto print receipt must be true or false',
            'open_cash_drawer.boolean' => 'Open cash drawer must be true or false',
            'low_stock_threshold.integer' => 'Low stock threshold must be a number',
            'low_stock_threshold.min' => 'Low stock threshold cannot be negative',
            'offline_mode.boolean' => 'Offline mode must be true or false',
            'auto_sync.boolean' => 'Auto sync must be true or false',
            'sync_interval.integer' => 'Sync interval must be a number',
            'sync_interval.min' => 'Sync interval must be at least 1',
        ];
    }
}