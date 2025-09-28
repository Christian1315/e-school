<?php

namespace App\Imports;

use App\Models\Apprenant;
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

        dd($row);
        /**
         * 
         */
        if (!isset($row[0]) || !isset($row[1]) || !isset($row[2]) || !isset($row[3])) {
            throw new \Exception("Tous les champs (nom, Prénom,email, phone) sont réquis!");
        }

        if (Apprenant::firstWhere("email", $row[2])) {
            throw new \Exception("Erreure de validation de la ligne: $rowIndex . Le mail $row[2] existe déjà!");
        }

        // dd(User::firstWhere("email",$row[2]));
        /**
         * Creation du user
         */
        $user = User::create([
            'firstname' => $rowData[0],
            'lastname' => $rowData[1],
            'email' => $rowData[2],
        ]);
    }
}
