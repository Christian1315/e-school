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
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $appends = ["apprenants"];

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
    public function classes(): HasMany
    {
        return $this->hasMany(ClasseProfesseur::class, "professeur_id");
    }

    /**
     * Matieres
     */
    public function matieres(): HasMany
    {
        return $this->hasMany(ClasseProfesseur::class, "professeur_id");
    }

    /**
     * Apprenants
     */
    function getApprenantsAttribute()
    {
        $apprenants = [];

        // les apprennants du Professeur connecté
        if ($this->hasRole("Professeur")) {
            $classeIds = $this->classes
                ->pluck("classe_id")
                ->toArray();
            $apprenants = Apprenant::whereIn("classe_id", $classeIds)
                ->with(["school", "parent", "classe.serie"])
                ->get();
        }

        // les apprenents du Parent connecté
        if ($this->hasRole("Parent")) {
            $apprenants = $this->ParentApprenants;
        }

        return $apprenants;
    }

    /**
     * Parent' apprenants
     */
    public function ParentApprenants(): HasMany
    {
        return $this->hasMany(Apprenant::class, "parent_id")
            ->with(["classe.serie"]);
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
            Log::debug("L'école concernée :", ["school" => request()->get("school_id")]);
            if (!request()->get("school_id")) {
                $model->school_id = Auth::user()?->school_id;
            }
        });
    }
}
