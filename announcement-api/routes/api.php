<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\AssetController;
use App\Http\Controllers\API\UserController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

// Public (Viewer)
Route::prefix('public')->group(function () {
    Route::get('announcements', [AnnouncementController::class, 'index']);
    Route::get('announcements/{announcement}', [AnnouncementController::class, 'show']);
    Route::get('assets/{asset}', [AssetController::class, 'show']);
    Route::get('assets/{asset}/stream', [AssetController::class, 'stream']);
});

// Admin (JWT protected & role=admin)
Route::prefix('admin')->middleware(['auth:api', 'admin'])->group(function () {
    Route::post('announcements', [AnnouncementController::class, 'store']);
    Route::put('announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::patch('announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy']);

    Route::post('assets', [AssetController::class, 'store']);
    Route::delete('assets/{asset}', [AssetController::class, 'destroy']);

    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::patch('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
});
