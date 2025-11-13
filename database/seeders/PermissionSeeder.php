<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    private function createCrudValidatePermissions($name, $permission)
    {
        return [
            "Voir les $name" => "$permission.view",
            "Créer des $name" => "$permission.create",
            "Modifier les $name" => "$permission.edit",
            "Supprimer des $name" => "$permission.delete",
        ];
    }

    public function run(): void
    {
        $permissions_groups = [
            'Ecoles' => array_merge(
                $this->createCrudValidatePermissions('écoles', 'ecole'),
                ["Activer une école" => "ecole.activate", "Désactiver une école" => "ecole.desactivate"]
            ),
            "Apprenants" => $this->createCrudValidatePermissions("apprenants", "apprenant"),
            "Inscriptions" => array_merge(
                $this->createCrudValidatePermissions("inscriptions", "inscription"),
                ["Imprimer un reçu" => "inscription.imprimer.receit"]
            ),
            "Paiements" => array_merge(
                $this->createCrudValidatePermissions("paiements", "paiement"),
                ["Imprimer un reçu" => "paiement.imprimer.receit"]
            ),

            "Interrogations" => $this->createCrudValidatePermissions("interrogations", "interrogation"),
            "Devoirs" => $this->createCrudValidatePermissions("devoirs", "devoir"),

            "Moyennes des interrogations" => $this->createCrudValidatePermissions("moyennes des interrogations", "moyenne_interro"),
            "Moyennes des devoirs" => $this->createCrudValidatePermissions("moyennes des devoirs", "moyenne_devoir"),

            "Bulletins" => array_merge(
                $this->createCrudValidatePermissions("bulletins", "bulletin"),
                ["Imprimer un bulletin" => "bulletin.imprimer"]
            ),

            "Utilisateurs" => array_merge(
                $this->createCrudValidatePermissions("utilisateurs", "utilisateur"),
                ["Désactiver un utilisateur" => "desactiver.user"],
            ),

            "Classes" => $this->createCrudValidatePermissions("classes", "classe"),
            "Series" => $this->createCrudValidatePermissions("séries", "serie"),
            "Matières" => $this->createCrudValidatePermissions("matières", "matiere"),
            "Trimestres" => $this->createCrudValidatePermissions("trimestres", "trimestre"),

            "Rôles" => array_merge(
                $this->createCrudValidatePermissions("rôles", "role"),
                ["Affecter un rôle" => "affect.role"],
            ),
        ];

        foreach ($permissions_groups as $group => $permissions) {
            foreach ($permissions as $description => $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission, 'guard_name' => 'web'],
                    ['name' => $permission, 'group_name' => $group, 'description' => $description]
                );
            }
        }
    }
}
