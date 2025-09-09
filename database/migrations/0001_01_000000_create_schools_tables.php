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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('raison_sociale');
            $table->string('adresse');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('logo')->nullable();
            $table->string('ifu')->nullable();
            $table->string('rccm')->nullable();
            $table->boolean('statut')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools_tables');
    }
};
