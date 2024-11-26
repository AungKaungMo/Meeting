<?php

namespace App\Http\Controllers\Web\v1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Package;
use App\Providers\RouteServiceProvider;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    use FilterSortPaginate;

    public function index(Request $request)
    {
        try {
            $query = Company::query()->with('package:id,name');

            $filterFields = ['name', 'short_name', 'package.name'];
            $companies = $this->filterSortPaginate($query, $request, $filterFields);

            $packages = Package::select('id', 'name')->where('status', 1)->get();

            return Inertia::render('MasterData/Company/CompanyList', [
                'companies' => $companies,
                'packages' => $packages,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to fetch company: ' . $th->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:255',
            'profile_image_url' => 'nullable|image|max:2048',
            'expire_date' => 'required|numeric|min:0',
            'package_id' => 'required'
        ]);

        try {
            $path = null;

            if ($request->hasFile('profile_image_url')) {
                $path = $request->file('profile_image_url')->store('companies', 'public');
            }

            $companyId = generateUniqueId($request->short_name, Company::class, 'company_id');

            Company::create([
                'name' => $request->name,
                'password' => Hash::make('company_pass_123456'),
                'short_name' => $request->short_name,
                'profile_image_url' => $path,
                'expire_date' => $request->expire_date,
                'package_id' => $request->package_id,
                'type' => 'client',
                'company_id' => $companyId
            ]);

            return redirect()->route('companies.index')->with('success', 'Company created successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to create company: ' . $th->getMessage()])->withInput();
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'short_name' => 'required|string|max:255',
                'expire_date' => 'required|numeric|min:0',
                'package_id' => 'required'
            ]);

            $path = null;

            if ($request->hasFile('profile_image_url')) {
                $path = $request->file('profile_image_url')->store('companies', 'public');
            }

            $company = Company::findOrFail($id);

            if ($company) {

                if ($request->changeImage && $company->profile_image_url) {
                    Storage::disk('public')->delete($company->profile_image_url);
                }

                $photoPath = ($request->changeImage && !$request->hasFile('profile_image_url'))
                    ? null
                    : ($path ?? $company->profile_image_url);

                $company->update([
                    'name' => $request->name,
                    'short_name' => $request->short_name,
                    'profile_image_url' => $photoPath,
                    'expire_date' => $request->expire_date,
                    'package_id' => $request->package_id,
                    'status' => $request->status,
                ]);
            }

            return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to update company: ' . $th->getMessage()])->withInput();
        }
    }

    public function destroy(string $id)
    {
        try {
            $company = Company::findOrFail($id);
            if ($company) {
                $company->delete();
            }

            return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete company: ' . $th->getMessage()])->withInput();
        }
    }

    public function showLoginForm()
    {
        return inertia('MasterData/Company/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'company_id' => 'required',
            'password' => 'required'
        ]);

        try {
            $credentials = $request->only('company_id', 'password');

            if (Auth::guard('company')->attempt($credentials)) {
                $request->session()->regenerate();
                return redirect(RouteServiceProvider::HOME);
            }

            return back()->withErrors(['company_id' => "These credentials do not match our records."]);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    public function logout()
    {
        Auth::guard('company')->logout();

        return redirect()->route('company.loginForm');
    }
}
