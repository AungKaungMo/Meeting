<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingMinute extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];

    public function meeting_attendance()
    {
        return $this->belongsTo(MeetingAttendance::class, 'meeting_attendance_id');
    }

    public function meeting_attendance_participants()
    {
        return $this->belongsToMany(Employee::class, 'meeting_attendance_participants', 'meeting_attendance_id', 'employee_id');
    }

    public function meeting_invitation()
    {
        return $this->meeting_attendance()->with('meeting_invitation');
    }
}
