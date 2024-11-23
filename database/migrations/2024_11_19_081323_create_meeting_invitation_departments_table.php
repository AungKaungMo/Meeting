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
        Schema::create('meeting_invitation_departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_invitation_id')->constrained('meeting_invitations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_invitation_departments');
    }
};
