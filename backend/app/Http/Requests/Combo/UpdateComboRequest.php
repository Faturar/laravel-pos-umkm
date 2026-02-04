<?php

namespace App\Http\Requests\Combo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComboRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'outlet_id' => 'nullable|exists:outlets,id',
            'items' => 'sometimes|array|min:1',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.qty' => 'required_with:items|integer|min:1',
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.string' => 'Combo name must be a string',
            'name.max' => 'Combo name may not be greater than 255 characters',
            'price.numeric' => 'Combo price must be a number',
            'price.min' => 'Combo price must be at least 0',
            'is_active.boolean' => 'Is active field must be true or false',
            'outlet_id.exists' => 'Selected outlet does not exist',
            'items.array' => 'Combo items must be an array',
            'items.min' => 'Combo must have at least 1 item',
            'items.*.product_id.required_with' => 'Product ID is required for each item',
            'items.*.product_id.exists' => 'Selected product does not exist',
            'items.*.variant_id.exists' => 'Selected variant does not exist',
            'items.*.qty.required_with' => 'Quantity is required for each item',
            'items.*.qty.integer' => 'Quantity must be an integer',
            'items.*.qty.min' => 'Quantity must be at least 1',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('items')) {
            $items = $this->items;
            
            // Ensure each item has a default qty of 1 if not provided
            foreach ($items as &$item) {
                if (!isset($item['qty'])) {
                    $item['qty'] = 1;
                }
            }
            
            $this->merge(['items' => $items]);
        }
    }
}