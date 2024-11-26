<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAttendance extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];

    public function meeting_invitation()
    {
        return $this->belongsTo(MeetingInvitation::class);
    }

    public function pic()
    {
        return $this->belongsTo(Employee::class);
    }

    public function attendance_participants()
    {
        return $this->belongsToMany(Employee::class, 'meeting_attendance_participants');
    }

    public function attendances()
    {
        return $this->hasMany(MeetingAttendanceParticipants::class);
    }
}
