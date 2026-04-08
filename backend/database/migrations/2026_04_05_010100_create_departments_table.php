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
        // Use CREATE to build the table for the first time
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., Medical, Security, Janitorial
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            // This links the department to its main office/location
            $table->foreignId('location_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
