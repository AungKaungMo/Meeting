<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\RegionState;
use App\Models\Township;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TownshipController extends Controller
{
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = Township::query()->with('region_state:id,name');

            $filterFields = ['name', 'region_state.name'];
            $townships = $this->filterSortPaginate($query, $request, $filterFields);

            $region_states = RegionState::select('id', 'name')->where('status', 1)->get();

            return Inertia::render('MasterData/Township/TownshipList', [
                'townships' => $townships,
                'region_states' => $region_states,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch townships: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'region_state_id' => 'required'
        ]);

        try {
            Township::firstOrCreate([
                'name' => $request->name,
                'region_state_id' => $request->region_state_id,
            ]);

            return redirect()->route('townships.index')->with('success', 'Township created successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to create township: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'region_state_id' => 'required'
        ]);

        try {
            $townships = Township::findOrFail($id);
            $townships->update([
                'name' => $request->name,
                'region_state_id' => $request->region_state_id,
                'status' => $request->status
            ]);

            return redirect()->route('townships.index')->with('success', 'Township updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create township: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $townships = Township::findOrFail($id);
            if ($townships) {
                $townships->delete();
            }

            return redirect()->route('townships.index')->with('success', 'Township deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete township: ' . $th->getMessage()])->withInput();
        }
    }
}
