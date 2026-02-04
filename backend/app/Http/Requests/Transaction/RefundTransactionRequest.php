<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class RefundTransactionRequest extends FormRequest
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
            'refund_amount' => 'required|numeric|min:0|max:1000000000',
            'refund_reason' => 'required|string|min:5|max:500',
            'payment_reference' => 'nullable|string|max:255',
            'items_to_refund' => 'required|array|min:1',
            'items_to_refund.*' => 'exists:transaction_items,id',
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
            'refund_amount.required' => 'Refund amount is required',
            'refund_amount.min' => 'Refund amount must be at least 0',
            'refund_amount.max' => 'Refund amount is too large',
            'refund_reason.required' => 'Refund reason is required',
            'refund_reason.min' => 'Refund reason must be at least 5 characters',
            'refund_reason.max' => 'Refund reason must not exceed 500 characters',
            'items_to_refund.required' => 'At least one item must be selected for refund',
            'items_to_refund.min' => 'At least one item must be selected for refund',
            'items_to_refund.*.exists' => 'Selected item does not exist',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $transaction = $this->route('transaction');
            
            if ($transaction && $this->refund_amount > $transaction->total_amount) {
                $validator->errors()->add('refund_amount', 'Refund amount cannot exceed the original transaction amount');
            }
        });
    }
}