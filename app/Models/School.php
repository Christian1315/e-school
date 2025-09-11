<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolFactory> */
    use HasFactory, SoftDeletes;

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
    function handleLogo($request)
    {
        $photoPath = null;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('school_logos'), $name);
            $photoPath = asset('school_logos/' . $name);
        }

        return $photoPath;
    }
}
