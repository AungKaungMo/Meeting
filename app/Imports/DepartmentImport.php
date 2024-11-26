<?php

namespace App\Imports;

use App\Models\Department;
use Carbon\Carbon;
use Spatie\SimpleExcel\SimpleExcelReader;

class DepartmentImport
{
    public function import(string $filePath, string $extension, int $id): void
    {
        SimpleExcelReader::create($filePath, $extension)
            ->noHeaderRow()
            ->getRows()
            ->chunk(1000)
            ->each(function ($rows) use ($id) {
                $data = collect($rows)->map(function ($row) use ($id) {
                    return [
                        'name' => $row[0],
                        'short_name' => $row[1],
                        'code' => generateUniqueId($row[1], Department::class, 'code'),
                        'company_id' => $row[2] ?? $id,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                })->toArray();

                Department::insert($data);
            });
    }
}
