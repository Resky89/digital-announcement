<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Create pivot table for many-to-many relation
        if (!Schema::hasTable('announcement_asset')) {
            Schema::create('announcement_asset', function (Blueprint $table) {
                $table->unsignedBigInteger('announcement_id');
                $table->unsignedBigInteger('asset_id');
                $table->primary(['announcement_id', 'asset_id']);
                $table->foreign('announcement_id')
                    ->references('id')->on('announcements')
                    ->cascadeOnDelete();
                $table->foreign('asset_id')
                    ->references('id')->on('assets')
                    ->cascadeOnDelete();
            });
        }

        // Backfill from assets.announcement_id into pivot, then drop the column
        if (Schema::hasColumn('assets', 'announcement_id')) {
            $rows = DB::table('assets')
                ->whereNotNull('announcement_id')
                ->select('announcement_id', 'id as asset_id')
                ->get();

            foreach ($rows as $row) {
                DB::table('announcement_asset')->updateOrInsert([
                    'announcement_id' => $row->announcement_id,
                    'asset_id' => $row->asset_id,
                ], []);
            }

            // Drop FK then column if present
            Schema::table('assets', function (Blueprint $table) {
                try { $table->dropForeign(['announcement_id']); } catch (\Throwable $e) { /* ignore */ }
            });

            Schema::table('assets', function (Blueprint $table) {
                if (Schema::hasColumn('assets', 'announcement_id')) {
                    $table->dropColumn('announcement_id');
                }
            });
        }
    }

    public function down(): void
    {
        // Recreate announcement_id on assets (nullable) and try to backfill
        if (!Schema::hasColumn('assets', 'announcement_id')) {
            Schema::table('assets', function (Blueprint $table) {
                $table->unsignedBigInteger('announcement_id')->nullable()->after('id');
                $table->foreign('announcement_id')
                    ->references('id')->on('announcements')
                    ->cascadeOnDelete();
            });
        }

        if (Schema::hasTable('announcement_asset') && Schema::hasColumn('assets', 'announcement_id')) {
            $pairs = DB::table('announcement_asset')->select('announcement_id', 'asset_id')->get();
            foreach ($pairs as $pair) {
                // This will overwrite if multiple announcements per asset; acceptable for down migration
                DB::table('assets')->where('id', $pair->asset_id)->update(['announcement_id' => $pair->announcement_id]);
            }
        }

        // Drop pivot table
        Schema::dropIfExists('announcement_asset');
    }
};
