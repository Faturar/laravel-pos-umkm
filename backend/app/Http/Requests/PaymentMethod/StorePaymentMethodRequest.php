<?php

namespace App\Http\Requests\PaymentMethod;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentMethodRequest extends FormRequest
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
            'type' => 'required|in:Cash,QRIS,E-Wallet,Bank Transfer,Credit Card,Debit Card',
            'fee_type' => 'required|in:None,Fixed Amount,Percentage',
            'fee_value' => 'required|numeric|min:0',
            'is_default' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
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
            'name.required' => 'Payment method name is required',
            'name.string' => 'Payment method name must be a string',
            'name.max' => 'Payment method name may not be greater than 255 characters',
            'type.required' => 'Payment method type is required',
            'type.in' => 'Invalid payment method type',
            'fee_type.required' => 'Fee type is required',
            'fee_type.in' => 'Invalid fee type',
            'fee_value.required' => 'Fee value is required',
            'fee_value.numeric' => 'Fee value must be a number',
            'fee_value.min' => 'Fee value must be at least 0',
            'is_default.boolean' => 'Is default must be a boolean',
            'is_active.boolean' => 'Is active must be a boolean',
            'outlet_id.exists' => 'Selected outlet does not exist',
        ];
    }
}