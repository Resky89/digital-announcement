<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure authors exist
        if (User::count() === 0) {
            $this->call(UserSeeder::class);
        }

        $authors = User::inRandomOrder()->get();
        $count = 8;
        for ($i = 1; $i <= $count; $i++) {
            $author = $authors[$i % max(1, $authors->count())] ?? User::first();
            Announcement::firstOrCreate(
                ['title' => "Pengumuman $i"],
                [
                    'content' => "Konten pengumuman $i",
                    'author_id' => $author?->id,
                ]
            );
        }
    }
}
