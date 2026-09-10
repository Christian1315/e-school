<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Classe extends Model
{
    /** @use HasFactory<\Database\Factories\ClasseFactory> */
    use HasFactory, SoftDeletes;
    /**
     * fillbale
     */
    protected $fillable = [
        "libelle",
        "school_id",
        "serie_id",
        "scolarite",
        "created_by",
        "updated_by",
    ];

    /**
     * Casts
     */
    protected $casts = [
        "libelle"      => "string",
        "school_id"     => "integer",
        "serie_id"      => "integer",
        "scolarite"     => "decimal:2",
        "created_by"     => "integer",
        "updated_by"     => "integer",
    ];

    /**
     * Ecole
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Série de la classe
     */
    public function serie(): BelongsTo
    {
        return $this->belongsTo(Serie::class);
    }

    /**
     * Lignes
     */
    public function lignes()
    {
        return $this->hasMany(ClasseProfesseur::class);
    }

    /**
     * Apprenants
     */
    public function apprenants(): HasMany
    {
        return $this->hasMany(Apprenant::class);
    }

    /**
     * Professeurs
     */
    public function professeurs(): BelongsToMany
    {
        return $this->belongsToMany(User::class, "classe_professeur", "classe_id", "professeur_id");
    }

    /**
     * Matieres
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, "classe_matiere", "classe_id", "matiere_id")->withPivot("coefficient");
    }

    /**
     * Created By
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }

    /**
     * Updated By
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "updated_by");
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        // creating
        static::creating(function ($model) {
            $model->created_by = Auth::id();
            $model->school_id = Auth::user()->school_id;
        });

        // updating
        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }
}
