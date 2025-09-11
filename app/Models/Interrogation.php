<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Interrogation extends Model
{
    /** @use HasFactory<\Database\Factories\InterrogationFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "school_id",
        "apprenant_id",
        "trimestre_id",
        "matiere_id",
        "created_by",
        "updated_by",

        "note",
    ];

    /**
     * Casts
     */
    protected $casts = [
        "school_id"      => "integer",
        "apprenant_id"      => "integer",
        "trimestre_id"      => "integer",
        "matiere_id"      => "integer",
        "created_by"     => "integer",
        "updated_by"     => "integer",

        "note" => "decimal:2"
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
        return $this->belongsTo(Trimestre::class);
    }

    /**
     * Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
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
