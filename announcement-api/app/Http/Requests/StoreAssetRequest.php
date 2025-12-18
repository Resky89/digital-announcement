<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'announcement_id' => 'required|exists:announcements,id',
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg,pdf|max:5120',
        ];
    }
}
