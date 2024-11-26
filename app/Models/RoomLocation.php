<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomLocation extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];

    public function township()
    {
        return $this->belongsTo(Township::class);
    }

    public function region_state()
    {
        return $this->belongsTo(RegionState::class);
    }
}
