<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $search = (string) $request->query('search', '');

        $query = Announcement::with(['author', 'assets'])->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $items = $query->paginate($perPage);
        return response()->json($items);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = Auth::id();
        $announcement = Announcement::create($data);
        $announcement->load(['author', 'assets']);
        return response()->json($announcement, 201);
    }

    public function show(Announcement $announcement)
    {
        $announcement->load(['author', 'assets']);
        return response()->json($announcement);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $announcement->update($request->validated());
        $announcement->load(['author', 'assets']);
        return response()->json($announcement);
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->json(null, 204);
    }
}
