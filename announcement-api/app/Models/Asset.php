<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Asset extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'file_name',
        'file_path',
        'file_type',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    protected $hidden = [
        'pivot',
    ];

    public function announcements(): BelongsToMany
    {
        return $this->belongsToMany(Announcement::class, 'announcement_asset', 'asset_id', 'announcement_id');
    }
}
