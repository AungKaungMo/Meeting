<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\RegionState;
use App\Models\RoomLocation;
use App\Models\Township;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingRoomLocationController extends Controller
{
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = RoomLocation::query()->with(['region_state:id,name', 'township:id,name']);

            $filterFields = ['name', 'region_state.name', 'township.name'];
            $roomLocations = $this->filterSortPaginate($query, $request, $filterFields);

            $region_states = RegionState::select('id', 'name')->where('status', 1)->orderBy('name', 'asc')->get();
            $townships = Township::select('id', 'name', 'region_state_id')->where('status', 1)->orderBy('name', 'asc')->get();

            return Inertia::render('MasterData/RoomLocation/RoomLocationList', [
                'roomLocations' => $roomLocations,
                'townships' => $townships,
                'region_states' => $region_states,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch room locations: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'region_state_id' => 'required',
            'township_id' => 'required'
        ]);

        try {
            RoomLocation::firstOrCreate([
                'name' => $request->name,
                'region_state_id' => $request->region_state_id,
                'township_id' => $request->township_id,
            ]);

            return redirect()->route('room-locations.index')->with('success', 'Room Location created successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to create room location: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'region_state_id' => 'required',
            'township_id' => 'required'
        ]);

        try {
            $roomLocation = RoomLocation::findOrFail($id);
            $roomLocation->update([
                'name' => $request->name,
                'region_state_id' => $request->region_state_id,
                'township_id' => $request->township_id,
                'status' => $request->status
            ]);

            return redirect()->route('room-locations.index')->with('success', 'Room Location updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create room location: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $roomLocation = RoomLocation::findOrFail($id);
            if ($roomLocation) {
                $roomLocation->delete();
            }

            return redirect()->route('room-locations.index')->with('success', 'Room Location deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete room location: ' . $th->getMessage()])->withInput();
        }
    }
}
