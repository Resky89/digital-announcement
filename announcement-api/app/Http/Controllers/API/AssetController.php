<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use App\Services\AssetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $search = (string) $request->query('search', '');
        $announcementId = $request->query('announcement_id');

        $query = Asset::with('announcements:id,title')->latest('created_at');

        if (!is_null($announcementId)) {
            $query->whereHas('announcements', function ($q) use ($announcementId) {
                $q->where('announcements.id', (int) $announcementId);
            });
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('file_name', 'like', "%{$search}%")
                  ->orWhere('file_type', 'like', "%{$search}%");
            });
        }

        $items = $query->paginate($perPage);
        return response()->json($items);
    }

    public function store(StoreAssetRequest $request, AssetService $service)
    {
        $stored = $service->store($request->file('file'));
        $fileName = $request->input('file_name') ?: $stored['file_name'];

        $asset = Asset::create([
            'file_name' => $fileName,
            'file_path' => $stored['file_path'],
            'file_type' => $stored['file_type'],
            'created_at' => now(),
        ]);

        return response()->json($asset, 201);
    }

    public function show(Asset $asset)
    {
        $asset->load('announcements:id,title');
        return response()->json($asset);
    }

    public function stream(Asset $asset, Request $request)
    {
        $path = $asset->file_path;
        if (!Storage::disk('announcement_assets')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        $absolute = Storage::disk('announcement_assets')->path($path);
        $mime = mime_content_type($absolute) ?: 'application/octet-stream';
        $filesize = filesize($absolute);
        $range = $request->header('Range');

        if ($range) {
            if (!preg_match('/bytes=(\d*)-(\d*)/', $range, $matches)) {
                return response()->json(['message' => 'Invalid Range'], 416, ['Content-Range' => "bytes */$filesize"]);
            }

            $start = $matches[1] === '' ? null : (int) $matches[1];
            $end = $matches[2] === '' ? null : (int) $matches[2];

            if ($start === null && $end !== null) {
                $start = max($filesize - $end, 0);
                $end = $filesize - 1;
            } else {
                if ($start === null) {
                    $start = 0;
                }
                if ($end === null || $end >= $filesize) {
                    $end = $filesize - 1;
                }
            }

            if ($start > $end || $start >= $filesize) {
                return response()->json(['message' => 'Requested Range Not Satisfiable'], 416, ['Content-Range' => "bytes */$filesize"]);
            }

            $length = $end - $start + 1;

            return response()->stream(function () use ($absolute, $start, $length) {
                $handle = fopen($absolute, 'rb');
                if ($handle === false) {
                    return;
                }
                fseek($handle, $start);
                $bytesLeft = $length;
                $chunkSize = 8192;
                while ($bytesLeft > 0 && !feof($handle)) {
                    $read = $bytesLeft > $chunkSize ? $chunkSize : $bytesLeft;
                    $buffer = fread($handle, $read);
                    if ($buffer === false) {
                        break;
                    }
                    echo $buffer;
                    flush();
                    $bytesLeft -= strlen($buffer);
                }
                fclose($handle);
            }, 206, [
                'Content-Type' => $mime,
                'Content-Length' => (string) $length,
                'Content-Range' => "bytes $start-$end/$filesize",
                'Accept-Ranges' => 'bytes',
            ]);
        }

        return response()->stream(function () use ($absolute) {
            $handle = fopen($absolute, 'rb');
            if ($handle === false) {
                return;
            }
            while (!feof($handle)) {
                $buffer = fread($handle, 8192);
                if ($buffer === false) {
                    break;
                }
                echo $buffer;
                flush();
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => $mime,
            'Content-Length' => (string) $filesize,
            'Accept-Ranges' => 'bytes',
        ]);
    }

    public function destroy(Asset $asset, AssetService $service)
    {
        $service->delete($asset->file_path);
        $asset->delete();
        return response()->json(null, 204);
    }

    public function update(UpdateAssetRequest $request, Asset $asset, AssetService $service)
    {
        $payload = [];
        if ($request->filled('file_name')) {
            $payload['file_name'] = $request->input('file_name');
        }

        if ($request->hasFile('file')) {
            // delete old file, store new one
            $service->delete($asset->file_path);
            $stored = $service->store($request->file('file'));
            $payload['file_name'] = $payload['file_name'] ?? $stored['file_name'];
            $payload['file_path'] = $stored['file_path'];
            $payload['file_type'] = $stored['file_type'];
        }

        if (!empty($payload)) {
            $asset->update($payload);
        }

        return response()->json($asset->fresh());
    }
}
