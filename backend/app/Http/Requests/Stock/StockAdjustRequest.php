<?php

namespace App\Http\Requests\Stock;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'new_stock' => 'required|integer|min:0',
            'reason' => 'required|string|max:255',
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
            'product_id.required' => 'Product is required',
            'product_id.exists' => 'Selected product does not exist',
            'new_stock.required' => 'New stock quantity is required',
            'new_stock.integer' => 'Stock quantity must be a number',
            'new_stock.min' => 'Stock quantity cannot be negative',
            'reason.required' => 'Reason for adjustment is required',
            'reason.max' => 'Reason cannot exceed 255 characters',
        ];
    }
}