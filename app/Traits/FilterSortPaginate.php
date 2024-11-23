<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait FilterSortPaginate
{
    public function filterSortPaginate($query, Request $request, array $filterableFields = [], array $defaultSort = ['id', 'desc'])
    {
        if ($value = $request->input("filterName")) {
            $query->where(function ($query) use ($filterableFields, $value) {
                foreach ($filterableFields as $field) {
                    if (str_contains($field, '.')) {
                        [$relation, $relationField] = explode('.', $field);
                        $query->orWhereHas($relation, function ($query) use ($relationField, $value) {
                            $query->where($relationField, 'like', "%{$value}%");
                        });
                    } else if (is_numeric($value)) {
                        $query->orWhere($field, (int) $value);
                    } else {
                        $query->orWhere($field, 'like', "%{$value}%");
                    }
                }
            });
        }

        $sort = $request->input('sort') ?? $defaultSort[0];
        $direction = $request->input('direction') ?? $defaultSort[1];
        $query->orderBy($sort, $direction);

        $per_page = (int) $request->input('per_page', 10);
        return $query->paginate($per_page)->appends($request->except('page'));
    }
}
