<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index()
    {
        $items = Announcement::with(['author', 'assets'])->latest()->paginate(10);
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
