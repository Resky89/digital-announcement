<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'file' => 'sometimes|file|mimes:jpg,jpeg,png,gif,svg,mp4,mov,avi,mkv,webm,mpeg,mpg|max:10240',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->hasFile('file')) {
                $file = $this->file('file');
                $ext = strtolower($file->getClientOriginalExtension());
                $sizeKB = (int) ceil($file->getSize() / 1024);
                $videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'mpg'];
                if (in_array($ext, $videoExts, true)) {
                    if ($sizeKB > 10240) {
                        $validator->errors()->add('file', 'The file may not be greater than 10240 kilobytes for videos.');
                    }
                } else {
                    if ($sizeKB > 5120) {
                        $validator->errors()->add('file', 'The file may not be greater than 5120 kilobytes for images.');
                    }
                }
            }
        });
    }
}
