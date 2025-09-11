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
        Schema::create('moyenne_interrogations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')
                ->nullable()
                ->constrained('schools')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('apprenant_id')
                ->nullable()
                ->constrained('apprenants')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('trimestre_id')
                ->nullable()
                ->constrained('trimestres')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('matiere_id')
                ->nullable()
                ->constrained('matieres')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->decimal('moyenne', 10, 2)->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moyenne_interrogations');
    }
};
