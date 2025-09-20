<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Devoir extends Model
{
    /** @use HasFactory<\Database\Factories\DevoirFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "school_id",
        "apprenant_id",
        "trimestre_id",
        "matiere_id",
        "note",
        "created_by",
        "updated_by"
    ];

    /**
     * Casts
     */
    protected $casts = [
        "school_id"      => "integer",
        "apprenant_id"      => "integer",
        "trimestre_id"      => "integer",
        "matiere_id"      => "integer",
        "note"      => "decimal:2",
        "created_by"     => "integer",
        "updated_by"     => "integer"
    ];

    /**
     * Ecole
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Apprenant
     */
    public function apprenant(): BelongsTo
    {
        return $this->belongsTo(Apprenant::class, "apprenant_id");
    }

    /**
     * Trimestre
     */
    public function trimestre(): BelongsTo
    {
        return $this->belongsTo(Trimestre::class, "trimestre_id");
    }

    /**
     * Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, "matiere_id");
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

        // updating
        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }
}
