<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Imports\DepartmentImport;
use App\Models\Department;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    use FilterSortPaginate;

    public function index(Request $request)
    {
        try {
            $query = Department::query()->with('company:id,name')->where('company_id', $request->user()->id);

            $filterFields = ['name', 'short_name', 'code', 'company.name'];
            $departments = $this->filterSortPaginate($query, $request, $filterFields);

            return Inertia::render('MasterData/Department/DepartmentList', [
                'departments' => $departments,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch departments: '.$th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:255',
        ]);

        try {
            $deptId = generateUniqueId($request->short_name, Department::class, 'code');
            Department::firstOrCreate([
                'name' => $request->name,
                'short_name' => $request->short_name,
                'company_id' => $request->user()->id,
                'code' => $deptId,
            ]);

            return redirect()->route('departments.index')->with('success', 'Department created successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create department: '.$th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:255',
        ]);

        try {
            $department = Department::findOrFail($id);
            $department->update([
                'name' => $request->name,
                'short_name' => $request->short_name,
                'status' => $request->status,
            ]);

            return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());

            return back()->withErrors(['error' => 'Failed to create department: '.$th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $department = Department::findOrFail($id);
            if ($department) {
                $department->delete();
            }

            return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete department: '.$th->getMessage()])->withInput();
        }
    }

    public function importDepartments(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls',
        ]);

        try {
            $file = $request->file('file');

            $extension = strtolower($file->getClientOriginalExtension());

            match ($extension) {
                'csv' => 'csv',
                'xls', 'xlsx' => 'xlsx',
                default => throw new \InvalidArgumentException("Unsupported file type: {$extension}")
            };

            $importer = new DepartmentImport;
            $importer->import($file->getRealPath(), $extension, $request->user()->id);

            return redirect()->route('departments.index')->with('success', 'Department imported successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());

            return back()->withErrors(['error' => 'Import failed: '.$th->getMessage()]);
        }
    }
}
