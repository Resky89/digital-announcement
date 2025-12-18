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
            Asset::firstOrCreate(
                [
                    'announcement_id' => $ann->id,
                    'file_name' => "gambar_{$ann->id}.jpg",
                ],
                [
                    'file_path' => "/assets/gambar_{$ann->id}.jpg",
                    'file_type' => 'image/jpeg',
                ]
            );

            Asset::firstOrCreate(
                [
                    'announcement_id' => $ann->id,
                    'file_name' => "dokumen_{$ann->id}.pdf",
                ],
                [
                    'file_path' => "/assets/dokumen_{$ann->id}.pdf",
                    'file_type' => 'application/pdf',
                ]
            );
        }
    }
}
