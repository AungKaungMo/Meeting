<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait FilterSortPaginate
{
    public function filterSortPaginate($query, Request $request, array $filterableFields = [], array $defaultSort = ['id', 'desc'])
    {
        foreach ($filterableFields as $field) {
            if ($value = $request->input("filterName")) {
                $query->where($field, 'like', "%{$value}%");
            }
        }

        $sort = $request->input('sort') ?? $defaultSort[0];
        $direction = $request->input('direction') ?? $defaultSort[1];
        $query->orderBy($sort, $direction);

        $per_page = (int) $request->input('per_page', 10);
        return $query->paginate($per_page)->appends($request->except('page'));
    }
}
