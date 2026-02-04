<?php

namespace App\Http\Requests\Outlet;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOutletRequest extends FormRequest
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
        $outletId = $this->route('id');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:outlets,code,' . $outletId,
            'address' => 'sometimes|required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
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
            'name.required' => 'Outlet name is required',
            'name.max' => 'Outlet name cannot exceed 255 characters',
            'code.required' => 'Outlet code is required',
            'code.max' => 'Outlet code cannot exceed 50 characters',
            'code.unique' => 'Outlet code has already been taken',
            'address.required' => 'Outlet address is required',
            'address.max' => 'Outlet address cannot exceed 500 characters',
            'phone.max' => 'Phone number cannot exceed 20 characters',
            'email.email' => 'Please provide a valid email address',
            'email.max' => 'Email cannot exceed 255 characters',
            'is_active.boolean' => 'Active status must be true or false',
        ];
    }
}