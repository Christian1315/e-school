<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        "scolarite"     => "decimal:2",
        "created_by"     => "integer",
        "updated_by"     => "integer",
    ];

    /**
     * Eccole
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Apprenants
     */
    public function apprenants(): HasMany
    {
        return $this->hasMany(Apprenant::class);
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
        });

        // // created
        // static::created(function ($model) {
        //     $model->school_id = Auth::user()->school_id;
        // });

        // updating
        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }
}
