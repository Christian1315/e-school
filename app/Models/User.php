<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'school_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Detail
     */
    function detail(): HasOne
    {
        return $this->hasOne(Detail::class);
    }

    /**
     * School
     */
    function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Classes
     */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, "classe_professeur", "professeur_id", "classe_id");
    }

    /**
     * Notifications Recues
     */
    function notificationsReceived(): HasMany
    {
        return $this->hasMany(CustomNotification::class, "receiver_id");
    }

    /**
     * Notifications envoyées
     */
    function notificationsSended(): HasMany
    {
        return $this->hasMany(CustomNotification::class, "sender_id");
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        // creating
        static::creating(function ($model) {
            if (!request()->get("school_id")) {
                $model->school_id = Auth::user()?->school_id;
            }
        });
    }
}
