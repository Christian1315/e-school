<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Detail extends Model
{
    /** @use HasFactory<\Database\Factories\DetailFactory> */
    use HasFactory, SoftDeletes;

    protected $table="users_details";
    
    protected $fillable = [
        "user_id",
        "phone",
        "profile_img",
        "statut"
    ];

    /**
     * User
     */
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    /**
     * Upload photo
     */

    function handlePhoto($request)
    {
        $photoPath = null;

        if ($request->hasFile('profile_img')) {
            $file = $request->file('profile_img');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('profiles'), $name);
            $photoPath = asset('profiles/' . $name);
        }

        return $photoPath;
    }
}
