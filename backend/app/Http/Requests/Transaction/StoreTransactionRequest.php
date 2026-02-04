<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.notes' => 'nullable|string|max:255',
            'discount' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string|in:cash,card,qris,ewallet,bank_transfer,other',
            'paid_amount' => 'required|numeric|min:0',
            'payment_reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'customer_id' => 'nullable|exists:customers,id',
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
            'items.required' => 'At least one item is required',
            'items.min' => 'At least one item is required',
            'items.*.product_id.required' => 'Product ID is required',
            'items.*.product_id.exists' => 'Selected product does not exist',
            'items.*.variant_id.exists' => 'Selected variant does not exist',
            'items.*.qty.required' => 'Quantity is required',
            'items.*.qty.min' => 'Quantity must be at least 1',
            'items.*.price.min' => 'Price must be at least 0',
            'payment_method.required' => 'Payment method is required',
            'payment_method.in' => 'Invalid payment method',
            'paid_amount.required' => 'Paid amount is required',
            'paid_amount.min' => 'Paid amount must be at least 0',
            'customer_id.exists' => 'Selected customer does not exist',
            'outlet_id.exists' => 'Selected outlet does not exist',
        ];
    }
}