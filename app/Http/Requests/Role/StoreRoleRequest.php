<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255', 'unique:roles'],
            'label' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];

        // For update, make name unique except for current role
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $roleId = $this->route('id');
            $rules['name'] = ['required', 'string', 'max:255', 'unique:roles,name,' . $roleId];
        }

        return $rules;
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Role name is required',
            'name.unique' => 'This role name is already in use',
            'name.max' => 'Role name must not exceed 255 characters',
            'label.required' => 'Role label is required',
            'label.max' => 'Role label must not exceed 255 characters',
            'description.max' => 'Description must not exceed 1000 characters',
            'permissions.*.exists' => 'One or more selected permissions do not exist',
        ];
    }

    /**
     * Get the custom attributes for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'role name',
            'label' => 'role label',
            'description' => 'description',
            'permissions' => 'permissions',
        ];
    }
}