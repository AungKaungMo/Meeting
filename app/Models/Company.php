<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticateable;

class Company extends Authenticateable
{
    use HasFactory;
    protected $guarded = [];
    protected $hidden = ['created_at', 'updated_at'];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public static function generateCompanyId($shortName)
    {
        $timestamp = now()->timestamp;
        $newName = strtoupper(str_replace(' ', '', $shortName));
        $companyId = $newName . '-' . substr(hash('sha256', $shortName . $timestamp), 0, 6);

        while (self::where('company_id', $companyId)->exists()) {
            $timestamp = now()->timestamp;
            $companyId = $newName . '-' . substr(hash('sha256', $shortName . $timestamp), 0, 6);
        }

        return $companyId;
    }
}
