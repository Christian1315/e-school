<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
