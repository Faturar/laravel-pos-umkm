<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('id');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'sometimes|required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:50|unique:products,sku,' . $productId,
            'barcode' => 'nullable|string|max:50|unique:products,barcode,' . $productId,
            'image' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
            'track_stock' => 'sometimes|boolean',
            'stock_quantity' => 'required_with:track_stock,true|integer|min:0',
            'stock_alert_threshold' => 'required_with:track_stock,true|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'outlet_id' => 'nullable|exists:outlets,id',
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
            'name.required' => 'Product name is required',
            'name.string' => 'Product name must be a string',
            'name.max' => 'Product name may not be greater than 255 characters',
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
            'image.string' => 'Image must be a string',
            'image.max' => 'Image may not be greater than 255 characters',
            'is_active.boolean' => 'Is active must be a boolean',
            'track_stock.boolean' => 'Track stock must be a boolean',
            'stock_quantity.required_with' => 'Stock quantity is required when track stock is enabled',
            'stock_quantity.integer' => 'Stock quantity must be an integer',
            'stock_quantity.min' => 'Stock quantity must be greater than or equal to 0',
            'stock_alert_threshold.required_with' => 'Stock alert threshold is required when track stock is enabled',
            'stock_alert_threshold.integer' => 'Stock alert threshold must be an integer',
            'stock_alert_threshold.min' => 'Stock alert threshold must be greater than or equal to 0',
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'outlet_id.exists' => 'Selected outlet does not exist',
        ];
    }
}