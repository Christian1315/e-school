<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Payement extends Model
{
    /** @use HasFactory<\Database\Factories\PayementFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "school_id",
        "apprenant_id",

        "created_by",
        "updated_by",

        "montant",
        "paiement_receit",
    ];

    /**
     * Casts
     */
    protected $casts = [
        "school_id"      => "integer",
        "apprenant_id"      => "integer",

        "created_by"     => "integer",
        "updated_by"     => "integer",

        "montant" => "decimal:2",
        "paiement_receit" => "string"
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
     * Upload photo
     */
    function handlePhoto($request)
    {
        $photoPath = null;

        if ($request->hasFile('paiement_receit')) {
            $file = $request->file('paiement_receit');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('payements'), $name);
            $photoPath = asset('payements/' . $name);
        }

        return $photoPath;
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
