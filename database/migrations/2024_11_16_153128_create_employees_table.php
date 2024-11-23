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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('profile_image_url')->nullable();
            $table->string('password');
            $table->string('type')->default('employee');
            $table->enum('role', ['employee', 'dept_admin'])->default('employee');
            $table->foreignId('department_id')->constrained('departments')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('employees');
    }
};
