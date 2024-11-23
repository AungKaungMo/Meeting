<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\RegionState;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionAndStateController extends Controller
{
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = RegionState::query();

            $filterFields = ['name'];
            $region_states = $this->filterSortPaginate($query, $request, $filterFields);

            return Inertia::render('MasterData/RegionAndState/RegionAndStateList', [
                'region_states' => $region_states,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch regions and states: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            RegionState::firstOrCreate([
                'name' => $request->name,
            ]);

            return redirect()->route('region-states.index')->with('success', 'Regions and States created successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to create regions and states: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $region_states = RegionState::findOrFail($id);
            $region_states->update([
                'name' => $request->name,
                'status' => $request->status
            ]);

            return redirect()->route('region-states.index')->with('success', 'Regions and States updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create regions and states: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $region_states = RegionState::findOrFail($id);
            if ($region_states) {
                $region_states->delete();
            }

            return redirect()->route('region-states.index')->with('success', 'Regions and States deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete regions and states: ' . $th->getMessage()])->withInput();
        }
    }
}
