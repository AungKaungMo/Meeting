<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingInvitation extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];

    public function host_department()
    {
        return $this->belongsTo(Department::class, 'host_department_id', 'id');
    }

    public function host_by()
    {
        return $this->belongsTo(Employee::class, 'host_by_id', 'id');
    }

    public function created_by()
    {
        return $this->belongsTo(Employee::class, 'created_by_id', 'id');
    }

    public function room_location()
    {
        return $this->belongsTo(RoomLocation::class);
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'meeting_invitation_departments');
    }

    public function participants()
    {
        return $this->belongsToMany(Employee::class, 'meeting_participants');
    }

    public function invited_departments()
    {
        return $this->hasMany(MeetingInvitationDepartment::class);
    }

    public function invited_participants()
    {
        return $this->hasMany(MeetingParticipants::class);
    }
}
