<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AssetService
{
    public function store(UploadedFile $file, int $announcementId): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $type = in_array($extension, ['pdf']) ? 'pdf' : 'image';
        $dir = $type === 'pdf' ? 'assets/pdfs' : 'assets/images';
        $filename = uniqid() . '_' . time() . '.' . $extension;

        // Store into external announcement_assets disk
        $path = $file->storeAs($dir, $filename, 'announcement_assets');

        return [
            'announcement_id' => $announcementId,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $type,
        ];
    }

    public function delete(string $path): void
    {
        Storage::disk('announcement_assets')->delete($path);
    }
}
