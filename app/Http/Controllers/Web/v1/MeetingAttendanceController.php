<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\MeetingAttendance;
use App\Models\MeetingMinute;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MeetingAttendanceController extends Controller
{
    use FilterSortPaginate;

    public function index(Request $request)
    {
        try {
            $query = MeetingAttendance::query()
                ->with([
                    'meeting_invitation',
                    'meeting_invitation.host_department:id,name',
                    'meeting_invitation.room_location:id,name',
                    'meeting_invitation.participants:id,name',
                    'pic:id,name',
                    'attendance_participants' => function ($query) {
                        $query->select('employees.id', 'employees.name', 'meeting_attendance_participants.employee_id', 'meeting_attendance_participants.status');
                    },
                ]);

            if ($request->user()->role === 'employee') {
                $query->where(function ($q) use ($request) {
                    $q->whereHas('meeting_invitation.participants', function ($query) use ($request) {
                        $query->where('employees.id', $request->user()->id);
                    });

                    $q->orWhereRelation('meeting_invitation', 'host_by_id', $request->user()->id);
                    $q->orWhereRelation('meeting_invitation', 'created_by_id', $request->user()->id);
                });
            }

            $filterFields = ['meeting_invitation.title', 'pic.name'];
            $attendances = $this->filterSortPaginate($query, $request, $filterFields);

            return Inertia::render('Meeting/Attendance/MeetingAttendanceList', [
                'attendances' => $attendances,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch meeting attendances: '.$th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|integer',
            'pic_id' => 'required_if:status,1',
            'attendance_participants' => 'required_if:status,1|array',
        ], [
            'pic_id.required_if' => 'Pic is required when status is confirmed.',
            'attendance_participants.required_if' => 'Attendance Participants are required when status is confirmed.',
        ]);

        DB::beginTransaction();
        try {
            $attendance = MeetingAttendance::findOrFail($id);
            $attendance->update([
                'status' => $request->status,
                'pic_id' => $request->pic_id,
                'updated_by_id' => $request->user()->id,
            ]);

            if ($request->attendance_participants) {
                $attendance->attendances()->delete();
                $attendance->attendances()->createMany(
                    array_map(fn ($participant) => [
                        'employee_id' => $participant['employee_id'],
                        'status' => $participant['status'],
                    ], $request->attendance_participants)
                );
            }

            if ($request->status === 1) {
                MeetingMinute::create(['meeting_attendance_id' => $attendance->id]);
            }

            DB::commit();

            return redirect()->route('meeting-attendances.index')->with('success', 'Meeting Attendance keep successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());

            return back()->withErrors(['error' => 'Failed to keep meeting attendances: '.$th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        //
    }
}
