<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\MeetingAttendance;
use App\Models\MeetingInvitation;
use App\Models\RoomLocation;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MeetingInvitationController extends Controller
{
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = MeetingInvitation::query()
                ->with([
                    'host_department:id,name',
                    'host_by:id,name',
                    'created_by:id,name',
                    'room_location:id,name',
                    'departments:id,name',
                    'participants:id,name'
                ]);

            if ($request->user()->role === 'employee') {
                $query->where(function ($query) use ($request) {
                    $query->whereHas('participants', function ($query) use ($request) {
                        $query->where('employees.id', $request->user()->id); // Explicit table alias
                    })
                        ->orWhere('created_by_id', $request->user()->id)
                        ->orWhere('host_by_id', $request->user()->id);
                });
            }

            $filterFields = ['title', 'agenda', 'host_department.name', 'host_by.name', 'created_by.name', 'room_location.name'];
            $meetings = $this->filterSortPaginate($query, $request, $filterFields);

            $departmentId = Department::findOrFail($request->user()->department_id);
            $employees = Employee::select('id', 'name', 'department_id')->whereHas(
                'department',
                fn($query) =>
                $query->where('company_id', $departmentId?->company_id)
            )->where('status', 1)
                ->get();

            $departments = Department::select('id', 'name', 'code')->where('status', 1)->where('company_id', $departmentId?->company_id)->get();
            $roomLocations = RoomLocation::select('id', 'name')->where('company_id', $departmentId?->company_id)->where('status', 1)->get();

            return Inertia::render('Meeting/Invitation/MeetingInvitationList', [
                'meetings' => $meetings,
                'employees' => $employees,
                'departments' => $departments,
                'roomLocations' => $roomLocations,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to fetch employees: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'agenda' => 'required|string|max:255',
            'host_department_id' => 'required',
            'room_location_id' => 'required',
            'meeting_date' => 'required|numeric',
            'from' => 'required|numeric',
            'to' => 'required|numeric',
            'participants' => 'required|array',
            'host_by_id' => 'required',
        ]);

        DB::beginTransaction();
        try {


            $meeting = MeetingInvitation::firstOrCreate([
                'title' => $request->title,
                'agenda' => $request->agenda,
                'host_department_id' => $request->host_department_id,
                'room_location_id' => $request->room_location_id,
                'meeting_date' => $request->meeting_date,
                'from' => $request->from,
                'to' => $request->to,
                'host_by_id' => $request->host_by_id,
                'created_by_id' => $request->user()->id,
                'remark' => $request->remark,
            ]);

            if ($request->invited_departments) {
                $meeting->invited_departments()->createMany(
                    array_map(fn($departmentId) => ['department_id' => $departmentId], $request->invited_departments)
                );
            }

            if ($request->participants) {
                $meeting->invited_participants()->createMany(
                    array_map(fn($participantId) => ['employee_id' => $participantId], $request->participants)
                );
            }

            DB::commit();
            return redirect()->route('meeting-invitations.index')->with('success', 'Meeting Invitation created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create meeting invitation: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, String $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'agenda' => 'required|string|max:255',
            'host_department_id' => 'required',
            'room_location_id' => 'required',
            'meeting_date' => 'required|numeric',
            'from' => 'required|numeric',
            'to' => 'required|numeric',
            'participants' => 'required|array',
            'host_by_id' => 'required',
            'status' => 'required|in:0,1,2',
            'reason' => 'required_if:status,2'
        ], [
            'reason.required_if' => 'The reason field is required when status is canceled.'
        ]);

        DB::beginTransaction();
        try {
            $meeting = MeetingInvitation::findOrFail($id);

            if ($meeting->status === 1) {
                return back()->withErrors(['error' => 'Meeting invitation is already confirmed.'])->withInput();
            } else if ($meeting->status === 2) {
                return back()->withErrors(['error' => 'Meeting invitation is already canceled.'])->withInput();
            }

            $meeting->update([
                'title' => $request->title,
                'agenda' => $request->agenda,
                'host_department_id' => $request->host_department_id,
                'room_location_id' => $request->room_location_id,
                'meeting_date' => $request->meeting_date,
                'from' => $request->from,
                'to' => $request->to,
                'host_by_id' => $request->host_by_id,
                'remark' => $request->remark,
                'status' => $request->status,
                'reason' => $request->status === 2 ? $request->reason : null,
            ]);

            if ($request->invited_departments) {
                $meeting->invited_departments()->delete();
                $meeting->invited_departments()->createMany(
                    array_map(fn($departmentId) => ['department_id' => $departmentId], $request->invited_departments)
                );
            }

            if ($request->participants) {
                $meeting->invited_participants()->delete();
                $meeting->invited_participants()->createMany(
                    array_map(fn($participantId) => ['employee_id' => $participantId], $request->participants)
                );
            }

            if ($request->status === 1) {
                MeetingAttendance::create([
                    'meeting_invitation_id' => $meeting->id,
                ]);
            }

            DB::commit();
            return redirect()->route('meeting-invitations.index')->with('success', 'Meeting Invitation updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to update meeting invitation: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(String $id)
    {
        DB::beginTransaction();
        try {
            $meeting = MeetingInvitation::findOrFail($id);
            if ($meeting) {
                $meeting->invited_departments()->delete();
                $meeting->invited_participants()->delete();
                $meeting->delete();
            }

            DB::commit();
            return redirect()->route('meeting-invitation.index')->with('success', 'Meeting Invitation deleted successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete meeting invitation: ' . $th->getMessage()])->withInput();
        }
    }
}
