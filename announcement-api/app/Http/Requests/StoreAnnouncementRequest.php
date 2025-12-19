<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'assets' => 'sometimes|array',
            'assets.*' => 'file|mimes:jpg,jpeg,png,gif,svg,pdf|max:5120',
        ];
    }
}
