<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Announcement;
use App\Models\Asset;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        if (Announcement::count() === 0) {
            $this->call(AnnouncementSeeder::class);
        }

        $announcements = Announcement::all();
        foreach ($announcements as $ann) {
            $image = Asset::firstOrCreate(
                [ 'file_name' => "gambar_{$ann->id}.jpg" ],
                [
                    'file_path' => "assets/images/gambar_{$ann->id}.jpg",
                    'file_type' => 'image',
                    'created_at' => now(),
                ]
            );

            $video = Asset::firstOrCreate(
                [ 'file_name' => "video_{$ann->id}.mp4" ],
                [
                    'file_path' => "assets/videos/video_{$ann->id}.mp4",
                    'file_type' => 'video',
                    'created_at' => now(),
                ]
            );

            // Attach assets to the announcement via pivot
            $ann->assets()->syncWithoutDetaching([$image->id, $video->id]);
        }
    }
}
