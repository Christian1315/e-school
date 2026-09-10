<?php

namespace App\Imports;

use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\Detail;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;
use Maatwebsite\Excel\Row;

class ApprenantImport implements OnEachRow, WithSkipDuplicates
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();   // 👉 numéro de la ligne (1, 2, 3, ...)
        $rowData  = $row->toArray();    // 👉 données de la ligne

        // Exemple : ignorer la première ligne
        if ($rowIndex === 1) {
            return;
        }

        /**
         * 
         */
        if (!isset($row[0]) || !isset($row[1]) || !isset($row[2]) || !isset($row[3]) || !isset($row[4])) {
            throw new \Exception("Tous les champs (nom, Prénom, Parent,Série, Classe) sont réquis!");
        }

        /**Sexe */
        if (!in_array($row[3], ['Masculin', 'Féminin'])) {
            throw new \Exception("Erreure lors de l'insertion de la ligne: $rowIndex . Le sexe doit être soit (Masculin ou Féminin) $row[4] n'existe pas!");
        }

        /**Classe **/
        if (Auth::user()->school_id) {
            $isClasseExiste = isset($row[4]) ?
                Classe::where("school_id", Auth::user()->school_id)->firstWhere("id", $row[4]) : null;
        } else {
            $isClasseExiste = isset($row[4]) ?
                Classe::firstWhere("id" , $row[4]) : null;
        }

        if (!$isClasseExiste) {
            throw new \Exception("Erreure lors de l'insertion de la ligne: $rowIndex . La classe $row[4] n'existe pas!");
        }

        /**Parent */
        $isParentExiste = Detail::firstWhere("phone", $row[2]);
        if (!$isParentExiste) {
            throw new \Exception("Erreure lors de l'insertion de la ligne: $rowIndex . Le parent dont le numéro de telephone est $row[2] n'existe pas!");
        }

        /**
         * Creation du user
         */
        Apprenant::create([
            'firstname' => $rowData[0],
            'lastname' => $rowData[1],
            'parent_id' => $isParentExiste?->id,
            'classe_id' => $isClasseExiste?->id,
            'school_id' => Auth::user()->school_id,
        ]);
    }
}
