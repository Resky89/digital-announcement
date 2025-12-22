<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AssetService
{
    public function store(UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'mpg'];
        $type = in_array($extension, $videoExts) ? 'video' : 'image';
        $dir = $type === 'video' ? 'assets/videos' : 'assets/images';
        $filename = uniqid() . '_' . time() . '.' . $extension;

        // Store into external announcement_assets disk
        $path = $file->storeAs($dir, $filename, 'announcement_assets');

        return [
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $type,
        ];
    }

    public function delete(string $path): void
    {
        $root = config('filesystems.disks.announcement_assets.root');
        if (!$root || !is_dir($root)) {
            return;
        }
        try {
            Storage::disk('announcement_assets')->delete($path);
        } catch (\Throwable $e) {
            // no-op: avoid throwing on delete when storage is unavailable
        }
    }
}
