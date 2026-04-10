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
        "receipted",
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
        "receipted" => "boolean",
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

    /**
     * Upload photo
     */
    function handlePhoto()
    {
        $photoPath = null;
        $request = request();

        if ($request->hasFile('dossier_transfert')) {
            $file = $request->file('dossier_transfert');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('dossier_transferts'), $name);
            $photoPath = asset('dossier_transferts/' . $name);
        }

        return $photoPath;
    }

    protected function generateNumero()
    {
        return "INS-" . date("y-m-d") . '-' . $this->id;
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_by = Auth::id();
            $model->dossier_transfert = $model->handlePhoto();
            $model->school_id = Auth::user()->school_id ?? 1;
        });

        static::created(function ($model) {
            $model->numero = $model->generateNumero();
            $model->saveQuietly(); // avoids triggering events again
        });

        static::updated(function ($model) {
            $model->updated_by = Auth::id();
            $model->school_id = Auth::user()->school_id ?? 1;

            if (request()->hasFile('dossier_transfert')) {
                $model->dossier_transfert = $model->handlePhoto();
            } else {
                unset($model->dossier_transfert); // Prevent overwriting if no new file is uploaded
            }
            $model->saveQuietly();
        });
    }
}
