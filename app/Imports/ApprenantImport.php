<?php

namespace App\Imports;

use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\Detail;
use App\Models\Serie;
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
        if (!isset($row[0]) || !isset($row[1]) || !isset($row[2]) || !isset($row[4]) || !isset($row[5])) {
            throw new \Exception("Tous les champs (nom, Prénom, Parent,Série, Classe) sont réquis!");
        }

        /**Sexe */
        if (!in_array($row[4], ['Masculin', 'Féminin'])) {
            throw new \Exception("Erreure lors de l'insertion de la ligne: $rowIndex . Le sexe doit être soit (Masculin ou Féminin) $row[5] n'existe pas!");
        }

        /**Classe */
        $isClasseExiste = isset($row[5]) ?
            Classe::firstWhere(["libelle" => $row[5]]) : null;

        if (!$isClasseExiste) {
            throw new \Exception("Erreure lors de l'insertion de la ligne: $rowIndex . La classe $row[5] n'existe pas!");
        }

        /**Serie */
        if (Auth::user()->school_id) {
            $isSerieExiste = isset($row[3]) ?
                Serie::where("school_id", Auth::user()->school_id)->firstWhere(["libelle" => isset($row[3]) ? $row[3] : null]) : null;
        } else {
            $isSerieExiste = isset($row[3]) ?
                Serie::firstWhere(["libelle" => isset($row[3]) ? $row[3] : null]) : null;
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
            'serie_id' => $isSerieExiste?->id,
            'school_id' => Auth::user()->school_id,
        ]);
    }
}
