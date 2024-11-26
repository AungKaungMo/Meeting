<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\MeetingMinute;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeetingMinuteController extends Controller
{
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = MeetingMinute::query()->with([
                'meeting_attendance.meeting_invitation.host_department:id,name',
                'meeting_attendance.meeting_invitation.room_location:id,name',
                'meeting_attendance.pic:id,name',
            ]);

            if ($request->user()->role === 'employee') {
                $query->where(function ($q) use ($request) {
                    $q->whereHas('meeting_attendance.attendance_participants', function ($query) use ($request) {
                        $query->where('employees.id', $request->user()->id);
                    });

                    $q->orWhereRelation('meeting_attendance', 'pic_id', $request->user()->id);
                });
            }

            $filterFields = ['id'];
            $meeting_minutes = $this->filterSortPaginate($query, $request, $filterFields);

            $mapData = $meeting_minutes->items() ? collect($meeting_minutes->items())->map(function ($minute) {
                return [
                    'id' => $minute->id,
                    'detail' => $minute->detail,
                    'status' => $minute->status,
                    'title' => $minute->meeting_attendance->meeting_invitation->title ?? null,
                    'host_department' => $minute->meeting_attendance->meeting_invitation->host_department->name ?? null,
                    'room_location' => $minute->meeting_attendance->meeting_invitation->room_location->name ?? null,
                    'pic' => $minute->meeting_attendance->pic->name ?? null,
                    'date' => $minute->meeting_attendance->meeting_invitation->meeting_date ?? null,
                    'from' => $minute->meeting_attendance->meeting_invitation->from ?? null,
                    'to' => $minute->meeting_attendance->meeting_invitation->to ?? null,
                ];
            }) : [];

            $meeting_minutes = [
                'total' => $meeting_minutes->total(),
                'per_page' => $meeting_minutes->perPage(),
                'current_page' => $meeting_minutes->currentPage(),
                'data' => $mapData
            ];

            return Inertia::render('Meeting/Minute/MeetingMinuteList', [
                'meeting_minutes' => $meeting_minutes,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to fetch meeting minutes: ' . $th->getMessage()])->withInput();
        }
    }

    public function edit(string $id)
    {
        try {
            $meeting_minute = MeetingMinute::findOrFail($id);

            return Inertia::render('Meeting/Minute/WriteMinute', [
                'meeting_minute' => $meeting_minute
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch meeting minute: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:0,1,2',
            'detail' => 'required_if:status,1'
        ], [
            'pic_id.required_if' => 'Detail is required when status is confirmed.',
        ]);

        // dd(json_decode($request->detail));
        try {
            $meeting_minute = MeetingMinute::findOrFail($id);
            $meeting_minute->update([
                'detail' => $request->detail,
                'updated_by_id' => $request->user()->id,
                'status' => $request->status,
            ]);
            return redirect()->route('meeting-minutes.index')->with('success', 'Meeting Minute updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to update meeting minute: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        //
    }

    public function imageUpload(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,jpg,png,gif,svg|max:10240',
        ]);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $path = $request->file('image')->store('meeting-images', 'public');

            $res = array(
                'success' => 1,
                'file' => (object) array(
                    'url' => Storage::url($path)
                )
            );

            return response()->json($res);
        }

        return response()->json([
            'success' => 0,
            'message' => 'Failed to upload image.',
        ], 400);
    }
}
