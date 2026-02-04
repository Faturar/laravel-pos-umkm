<?php

namespace App\Http\Requests\ProductVariant;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductVariantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:50|unique:product_variants,sku',
            'barcode' => 'nullable|string|max:50|unique:product_variants,barcode',
            'is_active' => 'sometimes|boolean',
            'stock_quantity' => 'required|integer|min:0',
            'stock_alert_threshold' => 'required|integer|min:0',
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Variant name is required',
            'name.string' => 'Variant name must be a string',
            'name.max' => 'Variant name may not be greater than 255 characters',
            'description.string' => 'Description must be a string',
            'description.max' => 'Description may not be greater than 500 characters',
            'price.required' => 'Price is required',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price must be greater than or equal to 0',
            'cost.numeric' => 'Cost must be a number',
            'cost.min' => 'Cost must be greater than or equal to 0',
            'sku.string' => 'SKU must be a string',
            'sku.max' => 'SKU may not be greater than 50 characters',
            'sku.unique' => 'SKU has already been taken',
            'barcode.string' => 'Barcode must be a string',
            'barcode.max' => 'Barcode may not be greater than 50 characters',
            'barcode.unique' => 'Barcode has already been taken',
            'is_active.boolean' => 'Is active must be a boolean',
            'stock_quantity.required' => 'Stock quantity is required',
            'stock_quantity.integer' => 'Stock quantity must be an integer',
            'stock_quantity.min' => 'Stock quantity must be greater than or equal to 0',
            'stock_alert_threshold.required' => 'Stock alert threshold is required',
            'stock_alert_threshold.integer' => 'Stock alert threshold must be an integer',
            'stock_alert_threshold.min' => 'Stock alert threshold must be greater than or equal to 0',
        ];
    }
}