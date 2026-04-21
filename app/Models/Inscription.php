<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Inscription extends Model
{
    /** @use HasFactory<\Database\Factories\InscriptionFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "numero",
        "annee_scolaire",
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

        Log::debug("Handling photo upload", ["request_has_file" => $request->hasFile('dossier_transfert')]);
        
        if ($request->hasFile('dossier_transfert')) {
            try {
                $file = $request->file('dossier_transfert');
                
                // Vérifier que le fichier est valide
                if (!$file->isValid()) {
                    throw new \Exception("Le fichier téléchargé n'est pas valide.");
                }
                
                $uploadDir = public_path('dossier_transferts');
                
                // Créer le répertoire s'il n'existe pas
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                $name = time() . '_' . $file->getClientOriginalName();
                $file->move($uploadDir, $name);
                $photoPath = asset('dossier_transferts/' . $name);
                
                Log::info("Fichier téléchargé avec succès", ["filename" => $name, "path" => $photoPath]);
            } catch (\Exception $e) {
                Log::error("Erreur lors du téléchargement du fichier", ["error" => $e->getMessage()]);
                throw $e;
            }
        }

        Log::debug("Photo path after handling upload", ["photo_path" => $photoPath]);
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
            $model->school_id = Auth::user()->school_id;
        });

        static::created(function ($model) {
            $model->numero = $model->generateNumero();
            $model->saveQuietly(); // avoids triggering events again
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();

            if (request()->hasFile('dossier_transfert')) {
                Log::info("Handling photo upload on update");
                $model->dossier_transfert = $model->handlePhoto();
            } else {
                unset($model->dossier_transfert); // Prevent overwriting if no new file is uploaded
            }
        });
    }
}
