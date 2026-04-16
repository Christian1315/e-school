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
        Schema::create('permission_schools', function (Blueprint $table) {
            $table->id();
            $table->foreignId("school_id")
                ->nullable()->constrained("schools", "id")
                ->onUpdate("CASCADE")
                ->onDelete("CASCADE");
            $table->foreignId("permission_id")
                ->nullable()->constrained("permissions", "id")
                ->onUpdate("CASCADE")
                ->onDelete("CASCADE");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_schools');
    }
};
