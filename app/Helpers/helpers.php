<?php

use Illuminate\Support\Facades\DB;

if (!function_exists('generateUniqueId')) {
    /**
     * Generate a unique ID for any model.
     *
     * @param string $shortName Prefix for the ID
     * @param string $modelClass Fully qualified class name of the model
     * @param string $column Column name to check uniqueness
     * @return string
     */

    function generateUniqueId(string $shortName, string $modelClass, string $column = 'id'): string
    {
        $timestamp = now()->timestamp;
        $newName = strtoupper(str_replace(' ', '', $shortName));
        $uniqueId = $newName . '-' . substr(hash('sha256', $shortName . $timestamp), 0, 6);

        while (DB::table((new $modelClass)->getTable())->where($column, $uniqueId)->exists()) {
            $timestamp = now()->timestamp;
            $uniqueId = $newName . '-' . substr(hash('sha256', $shortName . $timestamp), 0, 6);
        }

        return $uniqueId;
    }
}
