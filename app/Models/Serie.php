<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Serie extends Model
{
    /** @use HasFactory<\Database\Factories\SerieFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "libelle",
        "school_id"
    ];

    /**
     * School
     */
    function school(): BelongsTo
    {
        return $this->belongsTo(School::class, "school_id");
    }

    static function booted()
    {
        static::creating(function ($serie) {
            if (Auth::user()->school_id) {
                $serie->school_id = Auth::user()->school_id;
            }
        });
    }
}
