<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Matiere extends Model
{
    /** @use HasFactory<\Database\Factories\MatiereFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "school_id",
        "created_by",
        "updated_by",
        "libelle",
        "coefficient",
    ];

    /**
     * Casts
     */
    protected $casts = [
        "school_id"      => "integer",
        "created_by"     => "integer",
        "updated_by"     => "integer",

        "libelle" => "string",
        "coefficient" => "decimal:2"
    ];

    /**
     * Ecole
     */

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Interrogations
     */

    public function interrogations(): HasMany
    {
        return $this->hasMany(Interrogation::class);
    }

    /**
     * Devoirs
     */

    public function devoirs(): HasMany
    {
        return $this->hasMany(Devoir::class);
    }

    /**
     * Moyenne interrogation 
     */
    function moyenneInterro(): HasMany
    {
        return $this->hasMany(MoyenneInterrogation::class);
    }

    /**
     * Moyenne devoirs 
     */
    function moyenneDevoir(): HasMany
    {
        return $this->hasMany(MoyenneDevoir::class);
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
            $model->update(["created_by" => Auth::id()]);
        });

        // updating
        static::updating(function ($model) {
            $model->update(["updated_by" => Auth::id()]);
        });
    }
}
