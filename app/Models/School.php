<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolFactory> */
    use HasFactory;

    /**
     * fillbale
     */
    protected $fillable = [
        "raison_sociale",
        "adresse",

        "email",
        "phone",

        "logo",
        "ifu",
        "rccm",
        "statut",

        "slogan",
        "description"
    ];

    /**
     * Casts
     */
    protected $casts = [
        "raison_sociale"      => "string",
        "adresse"      => "string",

        "email"     => "string",
        "phone"     => "string",

        "logo" => "string",
        "ifu" => "string",
        "rccm" => "string",
        "statut" => "boolean"
    ];

    /**
     * Upload logo
     */
    function handleLogo()
    {
        $photoPath = null;
        $request = request();

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('school_logos'), $name);
            $photoPath = asset('school_logos/' . $name);
        }

        return $photoPath;
    }

    /**
     * Users
     */
    function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Classe
     */
    function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }


    /**
     * Apprenants
     */
    function apprenants(): HasMany
    {
        return $this->hasMany(Apprenant::class);
    }

    /**
     * Notifications 
     */
    function notifications(): HasMany
    {
        return $this->hasMany(CustomNotification::class);
    }

    /**
     * Trimestres 
     */
    function trimestres(): HasMany
    {
        return $this->hasMany(Trimestre::class);
    }

    /**
     * Matières 
     */
    function matieres(): HasMany
    {
        return $this->hasMany(Matiere::class);
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
     * Moyenne devoirs 
     */
    function moyenneDevoir(): HasMany
    {
        return $this->hasMany(MoyenneDevoir::class);
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->logo = $model->handleLogo();
            // You can't set $model->numero here yet because the ID is not generated.
        });
    }
}
