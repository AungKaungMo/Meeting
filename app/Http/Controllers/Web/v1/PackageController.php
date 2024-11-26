<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    use FilterSortPaginate;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Package::query();

            $filterFields = ['name'];
            $packages = $this->filterSortPaginate($query, $request, $filterFields);

            return Inertia::render('MasterData/Package/PackageList', [
                'packages' => $packages,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'limit_employee' => 'required|in:0,1',
            'max_employee' => 'required_if:limit_employee,1|integer',
            'description' => 'required|json',
        ], [
            'max_employee.required_if' => 'The max employee field is required when limit employee is "yes".',
        ]);

        try {
            Package::create([
                'name' => $request->name,
                'limit_employee' => $request->limit_employee,
                'max_employee' => $request->max_employee,
                'description' => json_decode($request->description, true),
            ]);

            return redirect()->route('packages.index')->with('success', 'Package created successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create package: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'limit_employee' => 'required|in:0,1',
            'max_employee' => 'required_if:limit_employee,1|integer',
            'description' => 'required|json',
        ], [
            'max_employee.required_if' => 'The max employee field is required when limit employee is "yes".',
        ]);

        try {
            $package = Package::findOrFail($id);
            $package->update([
                'name' => $request->name,
                'limit_employee' => $request->limit_employee,
                'max_employee' => $request->max_employee,
                'description' => json_decode($request->description, true),
                'status' => $request->status
            ]);

            return redirect()->route('packages.index')->with('success', 'Package updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create package: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $package = Package::findOrFail($id);
            if ($package) {
                $package->delete();
            }

            return redirect()->route('packages.index')->with('success', 'Package deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete packages: ' . $th->getMessage()])->withInput();
        }
    }
}
