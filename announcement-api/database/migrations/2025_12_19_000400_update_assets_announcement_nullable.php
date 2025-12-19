<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Drop existing foreign key to alter column nullability
        Schema::table('assets', function (Blueprint $table) {
            $table->dropForeign(['announcement_id']);
        });

        // Make announcement_id nullable and re-add FK with null on delete
        Schema::table('assets', function (Blueprint $table) {
            $table->unsignedBigInteger('announcement_id')->nullable()->change();
            $table->foreign('announcement_id')
                ->references('id')->on('announcements')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Revert: make announcement_id NOT NULL and cascade on delete
        Schema::table('assets', function (Blueprint $table) {
            $table->dropForeign(['announcement_id']);
        });

        Schema::table('assets', function (Blueprint $table) {
            $table->unsignedBigInteger('announcement_id')->nullable(false)->change();
            $table->foreign('announcement_id')
                ->references('id')->on('announcements')
                ->cascadeOnDelete();
        });
    }
};
