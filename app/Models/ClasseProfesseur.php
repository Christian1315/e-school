<?php
// app/Models/ClasseProfesseur.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClasseProfesseur extends Model
{
    protected $table = 'classe_professeur';

    protected $fillable = [
        'classe_id',
        'professeur_id',
        'matiere_id',
        'coefficient',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function professeur()
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}
