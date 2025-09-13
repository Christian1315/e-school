<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Apprenant extends Model
{
    /** @use HasFactory<\Database\Factories\ApprenantFactory> */
    use HasFactory, SoftDeletes;

    /**
     * fillbale
     */
    protected $fillable = [
        "parent_id",
        "school_id",
        "classe_id",
        "firstname",
        "lastname",
        "adresse",
        "email",
        "phone",
        "date_naissance",
        "lieu_naissance",
        "sexe",
        "photo",
        "created_by",
        "updated_by"
    ];

    /**
     * Casts
     */
    protected $casts = [
        "parent_id"      => "integer",
        "school_id"      => "integer",
        "classe_id"      => "integer",
        "firstname"      => "string",
        "lastname"       => "string",
        "adresse"        => "string",
        "email"          => "string",   // et validation "email" ailleurs
        "phone"          => "string",   // ou custom cast si formatage
        "date_naissance" => "datetime",
        "lieu_naissance" => "string",
        "sexe"           => "string",
        "photo"          => "string",
        "created_by"     => "integer",
        "updated_by"     => "integer"
    ];

    /**
     * Eccole
     */

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Parent
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, "parent_id");
    }

    /**
     * Classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, "classe_id");
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

    function handlePhoto($request)
    {
        $photoPath = null;

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('profiles'), $name);
            $photoPath = asset('profiles/' . $name);
        }

        return $photoPath;
    }


    /**
     * Interrogations 
     */
    function interrogations(): HasMany
    {
        return $this->hasMany(Interrogation::class);
    }

    /**
     * Devoirs 
     */
    function devoirs(): HasMany
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
     * Inscriptions
     */
    function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Payements
     */
    function payements(): HasMany
    {
        return $this->hasMany(Payement::class);
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
