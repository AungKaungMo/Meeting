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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->tinyInteger('limit_employee')->default(1)->comment('1 mean true(import no limit employee), 0 mean false');
            $table->integer('max_employee')->nullable();
            $table->json('description');
            $table->tinyInteger('status')->default(1)->comment('1 mean true, 0 mean false');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
