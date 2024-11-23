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
        Schema::create('meeting_invitations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('agenda');
            $table->foreignId('host_department_id')->constrained('departments')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('room_location_id')->constrained('room_locations')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('meeting_date');
            $table->time('from');
            $table->time('to');
            $table->foreignId('host_by_id')->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('created_by_id')->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
            $table->string('remark')->nullable();
            $table->tinyInteger('status')->default(0)->comment('0 mean meeting waiting, 1 mean meeting confirm, 2 meain meeting cancel.');
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_invitations');
    }
};
