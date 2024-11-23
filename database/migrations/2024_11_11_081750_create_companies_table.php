<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company_id')->unique();
            $table->string('password');
            $table->string('short_name');
            $table->string('profile_image_url');
            $table->string('type')->default('client');
            $table->foreignId('package_id')->constrained('packages')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('expire_date');
            $table->tinyInteger('first_time_login')->default(1)->comment('if 1, we said to change password for login user.');
            $table->tinyInteger('status')->default(1)->comment('1 mean true, 0 mean false');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
