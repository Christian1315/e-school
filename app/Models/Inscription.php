<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Inscription extends Model
{
    /** @use HasFactory<\Database\Factories\InscriptionFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "numero",
        "school_id",
        "apprenant_id",
        "created_by",
        "updated_by",

        "numero_educ_master",
        "dossier_transfert",
        "frais_inscription"
    ];

    /**
     * Casts
     */
    protected $casts = [
        "numero" => 'string',
        "school_id"      => "integer",
        "apprenant_id"      => "integer",
        "created_by"     => "integer",
        "updated_by"     => "integer",

        "numero_educ_master" => "string",
        "dossier_transfert" => "string",
        "frais_inscription" => "decimal:2"
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

    protected function generateNumero()
    {
        return "000" . $this->id;
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_by = Auth::id();
            // You can't set $model->numero here yet because the ID is not generated.
        });

        static::created(function ($model) {
            $model->numero = "000" . $model->id;
            // Save once, no update inside update loop
            $model->saveQuietly(); // avoids triggering events again
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }
}
