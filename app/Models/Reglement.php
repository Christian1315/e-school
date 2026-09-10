<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Reglement extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected  $fillable = [
        "numero",

        "school_id",
        "transactionId",

        "montant",

        "created_by",
        "validated_by",
        "validated_at",

        "annee_scolaire",
    ];

    /**
     * Casts
     */

    protected $casts = [
    ];

    /**
     * Ecole
     */

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
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

    protected static function boot()
    {
        parent::boot();

        // creating
        static::creating(function ($model) {
            $model->created_by = Auth::id();
            $model->school_id = Auth::user()->school_id;
        });

        // 
        static::created(function ($model) {
            $model->numero = "REG-" . date("y-m-d") . '-' . $model->id;
            // Save once, no update inside update loop
            $model->saveQuietly(); // avoids triggering events again
        });
    }
}
