<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssetRequest;
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

        $query = Asset::with('announcement:id,title')->latest('created_at');

        if (!is_null($announcementId)) {
            $query->where('announcement_id', (int) $announcementId);
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
        $data = $service->store($request->file('file'), (int) $request->input('announcement_id'));

        $asset = Asset::create([
            'announcement_id' => $data['announcement_id'],
            'file_name' => $data['file_name'],
            'file_path' => $data['file_path'],
            'file_type' => $data['file_type'],
            'created_at' => now(),
        ]);

        return response()->json($asset, 201);
    }

    public function show(Asset $asset)
    {
        return response()->json($asset);
    }

    public function stream(Asset $asset)
    {
        $path = $asset->file_path;
        if (!Storage::disk('local')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        $absolute = Storage::disk('local')->path($path);
        $mime = mime_content_type($absolute) ?: 'application/octet-stream';
        return response()->file($absolute, ['Content-Type' => $mime]);
    }

    public function destroy(Asset $asset, AssetService $service)
    {
        $service->delete($asset->file_path);
        $asset->delete();
        return response()->json(null, 204);
    }
}
