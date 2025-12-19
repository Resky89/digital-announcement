<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file_name' => 'sometimes|string|max:255',
            'file' => 'sometimes|file|mimes:jpg,jpeg,png,gif,svg,pdf|max:5120',
        ];
    }
}
