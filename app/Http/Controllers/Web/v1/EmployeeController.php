<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Imports\EmployeeImport;
use App\Models\Department;
use App\Models\Employee;
use App\Providers\RouteServiceProvider;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use FilterSortPaginate;
    public function index(Request $request)
    {
        try {
            $query = Employee::query()
                ->with('department:id,name')
                ->whereHas(
                    'department',
                    fn($query) =>
                    $query->where('company_id', $request->user()->id)
                );

            $filterFields = ['name', 'employee_id', 'email', 'phone', 'role', 'department.name'];
            $employees = $this->filterSortPaginate($query, $request, $filterFields);

            $departments = Department::select('id', 'name')
                ->where('company_id', $request->user()->id)
                ->where('status', 1)
                ->get();

            return Inertia::render('MasterData/Employee/EmployeeList', [
                'employees' => $employees,
                'departments' => $departments,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch employees: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required',
            'phone' => 'nullable|string|max:15|required_without:email',
            'email' => 'nullable|email|string|required_without:phone',
        ]);

        try {
            $name = explode(' ', $request->name);
            $initialName = strtoupper(implode('', array_map(fn($word) => $word[0], $name)));

            $emp_id = generateUniqueId($initialName, Employee::class, 'employee_id');

            Employee::firstOrCreate([
                'name' => $request->name,
                'employee_id' => $emp_id,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make('employee_pass_123456'),
                'type' => 'employee',
                'role' => $request->role,
                'department_id' => $request->department_id
            ]);

            return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create employee: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required',
            'phone' => 'nullable|string|max:15|required_without:email',
            'email' => 'nullable|string|email|required_without:phone',
        ]);

        try {
            $employee = Employee::findOrFail($id);
            $employee->update([
                'name' => $request->name,
                'department_id' => $request->department_id,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
                'status' => $request->status
            ]);

            return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());
            return back()->withErrors(['error' => 'Failed to create employee: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $employee = Employee::findOrFail($id);
            if ($employee) {
                $employee->delete();
            }

            return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete employee: ' . $th->getMessage()])->withInput();
        }
    }

    public function importEmployees(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls'
        ]);

        try {
            $file = $request->file('file');

            $extension = strtolower($file->getClientOriginalExtension());

            match ($extension) {
                'csv' => 'csv',
                'xls', 'xlsx' => 'xlsx',
                default => throw new \InvalidArgumentException("Unsupported file type: {$extension}")
            };

            $importer = new EmployeeImport();
            $importer->import($file->getRealPath(), $extension);

            return redirect()->route('employees.index')->with('success', 'Employee imported successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Import failed: ' . $th->getMessage()]);
        }
    }

    public function showLoginForm()
    {
        return inertia('MasterData/Employee/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|max:255',
            'password' => 'required|string|max:255'
        ]);

        try {

            $credentials = $request->only('employee_id', 'password');

            if (Auth::guard('employee')->attempt($credentials)) {

                $employee = Auth::guard('employee')->user();

                if ($employee->status !== 1) {
                    Auth::guard('employee')->logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    return back()->withErrors(['employee_id' => 'Your account is inactive.']);
                }

                $request->session()->regenerate();
                if ($employee->first_time_login === 1) {
                    $request->session()->put('change_password', true);
                    return redirect()->route('employee.changePasswordForm');
                }

                return redirect()->route('meeting-invitations.index')->with('message', 'Login successful.');
                // return redirect(RouteServiceProvider::HOME);
            }

            return back()->withErrors(['employee_id' => "These credentials do not match our records."]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    public function showChangePasswordForm(Request $request)
    {
        $changePassword = $request->session()->get('change_password');
        if ($changePassword) {
            return inertia('MasterData/Employee/ChangePassword');
        } else {
            return redirect()->route('employee.login');
        }
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'new_password' => 'required|string|min:6|max:255',
            'confirm_password' => 'required|string|min:6|max:255'
        ]);

        try {
            $employee = Auth::guard('employee')->user();
            $employee->password = Hash::make($request->new_password);
            $employee->first_time_login = 0;
            $employee->save();

            return redirect(RouteServiceProvider::HOME);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    public function logout()
    {
        Auth::guard('employee')->logout();

        return redirect()->route('employee.loginForm');
    }
}
