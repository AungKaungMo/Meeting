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
        $query = Package::query();

        $filterFields = ['name', 'max_employee'];
        $packages = $this->filterSortPaginate($query, $request, $filterFields);

        return Inertia::render('Adminstration/Package/PackageList', [
            'packages' => $packages,
            'sort' => $request->input('sort'),
            'direction' => $request->input('direction'),
            'filter' => $request->input('filterName'),
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
