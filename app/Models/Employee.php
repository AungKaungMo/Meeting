<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticateable;

class Employee extends Authenticateable
{
    use HasFactory;
    protected $guarded = [];
    protected $hidden = ['created_at', 'updated_at'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function meeting_participants()
    {
        return $this->belongsToMany(MeetingInvitation::class, 'meeting_participants');
    }
}
