<?php

namespace App\Imports;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Spatie\SimpleExcel\SimpleExcelReader;

class EmployeeImport
{
    public function import(string $filePath, string $extension): void
    {
        SimpleExcelReader::create($filePath, $extension)
            ->noHeaderRow()
            ->getRows()
            ->chunk(1000)
            ->each(function ($rows) {
                $data = collect($rows)->map(function ($row) {
                    $name = explode(' ', $row[0]);
                    $initialName = strtoupper(implode('', array_map(fn ($word) => $word[0], $name)));
                    $emp_id = generateUniqueId($initialName, Employee::class, 'employee_id');

                    $department = Department::where('code', $row[3])->select('id')->first();
                    if (! $department) {
                        return;
                    }

                    return [
                        'name' => $row[0],
                        'employee_id' => $emp_id,
                        'email' => $row[1],
                        'phone' => $row[2],
                        'password' => Hash::make('employee_pass_123456'),
                        'type' => 'employee',
                        'department_id' => $department->id,
                        'role' => $row[4],
                    ];
                })->toArray();

                Employee::insert($data);
            });
    }
}
