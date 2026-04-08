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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('location_id')->constrained();
            $table->foreignId('department_id')->constrained();


            $table->string('title');
            $table->text('content');

            $table->enum('status', ['needs-attention', 'in-progress', 'resolved'])->default('needs-attention');
            $table->string('priority')->default(1);


            $table->json('ai_summary')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
