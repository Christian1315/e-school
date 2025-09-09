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
        Schema::create('apprenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('school_id')
                ->nullable()
                ->constrained('schools')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('classe_id')
                ->nullable()
                ->constrained('classes')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string("firstname");
            $table->string("lastname");
            $table->string("adresse")->nullable();
            $table->string("email")->nullable();
            $table->string("phone")->nullable();
            $table->date("date_naissance")->nullable();
            $table->string("lieu_naissance")->nullable();
            $table->enum("sexe", ["Masculin", "Féminin"])->nullable();

            $table->text("photo")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apprenants');
    }
};
