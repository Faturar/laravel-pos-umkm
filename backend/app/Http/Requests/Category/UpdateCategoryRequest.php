<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
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
            'name.required' => 'Category name is required',
            'name.string' => 'Category name must be a string',
            'name.max' => 'Category name may not be greater than 255 characters',
            'description.string' => 'Description must be a string',
            'description.max' => 'Description may not be greater than 500 characters',
            'color.string' => 'Color must be a string',
            'color.max' => 'Color may not be greater than 7 characters',
            'is_active.boolean' => 'Is active must be a boolean',
            'outlet_id.exists' => 'Selected outlet does not exist',
        ];
    }
}