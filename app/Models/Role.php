<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    protected $fillable = [
        "name",
        "school_id",
        "guard_name"
    ];

    /**
     * School
     */
    function school(): BelongsTo
    {
        return $this->belongsTo(School::class, "school_id");
    }
}
