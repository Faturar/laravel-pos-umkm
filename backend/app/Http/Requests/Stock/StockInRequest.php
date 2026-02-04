<?php

namespace App\Http\Requests\Stock;

use Illuminate\Foundation\Http\FormRequest;

class StockInRequest extends FormRequest
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
            'quantity' => 'required|integer|min:1',
            'cost' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
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
            'quantity.required' => 'Quantity is required',
            'quantity.integer' => 'Quantity must be a number',
            'quantity.min' => 'Quantity must be at least 1',
            'cost.required' => 'Cost is required',
            'cost.numeric' => 'Cost must be a number',
            'cost.min' => 'Cost cannot be negative',
            'description.max' => 'Description cannot exceed 255 characters',
        ];
    }
}