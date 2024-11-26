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
        Schema::create('meeting_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_invitation_id')->constrained('meeting_invitations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('pic_id')->nullable()->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('updated_by_id')->nullable()->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
            $table->tinyInteger('status')->default(0)->comment('0 mean meeting waiting, 1 mean meeting confirm, 2 mean draft.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_attendances');
    }
};
