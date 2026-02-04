<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class VoidTransactionRequest extends FormRequest
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
            'reason' => 'required|string|min:5|max:500',
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
            'reason.required' => 'Void reason is required',
            'reason.min' => 'Void reason must be at least 5 characters',
            'reason.max' => 'Void reason must not exceed 500 characters',
        ];
    }
}