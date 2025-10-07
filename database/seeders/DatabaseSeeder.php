<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Trimestre;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

         /**
         * Users
         */
        $user = User::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'E-school',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin@2025'), // mot de passe par défaut
        ]);

        $user->detail()->create([
            "phone" => "+2290156854397",
            "profile_img" => asset("fichisers/images/logo.png"),
        ]);

        /**
         * Les roles & permissions
         */
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            AllPermissionToSuperAdminSeeder::class
        ]);

        /**
         * Matiere
         */
        Matiere::insert([
            [
                "libelle" => "Mathématique",
                "coefficient" => 3,
            ],
            [
                "libelle" => "PCT",
                "coefficient" => 3,
            ],
            [
                "libelle" => "Français",
                "coefficient" => 3,
            ],
            [
                "libelle" => "Philosophie",
                "coefficient" => 2,
            ],
            [
                "libelle" => "Anglais",
                "coefficient" => 2,
            ],
            [
                "libelle" => "Conduite",
                "coefficient" => 1,
            ],
            [
                "libelle" => "Sport",
                "coefficient" => 1,
            ],
        ]);

        /**
         * Trimestre
         */
        Trimestre::insert([
            ["libelle" => "1 Trimestre"],
            ["libelle" => "2 Trimestre"],
            ["libelle" => "2 Trimestre"],
        ]);

        /**
         * Classes
         */
        Classe::insert([
            ["libelle" => "6 ième", "scolarite" => 100000],
            ["libelle" => "5 ième", "scolarite" => 300000],
            ["libelle" => "4 ième", "scolarite" => 300000],
            ["libelle" => "3 ième", "scolarite" => 300000],
            ["libelle" => "Seconde", "scolarite" => 100000],
            ["libelle" => "Première", "scolarite" => 200000],
            ["libelle" => "Terminale", "scolarite" => 100000],
        ]);

        /**
         * Serie
         */
        Serie::insert([
            ["libelle" => "A"],
            ["libelle" => "A1"],
            ["libelle" => "A2"],
            ["libelle" => "B"],
            ["libelle" => "C"],
            ["libelle" => "D"],
            ["libelle" => "E"],
            ["libelle" => "F"],
            ["libelle" => "G2"],
        ]);

        /**
         * School Seed
         */
        // $schools = School::factory()
        //     ->count(3)
        //     ->has(
        //         User::factory()
        //             ->count(10)
        //             ->has(
        //                 Detail::factory()->state([
        //                     "created_by" => 1,
        //                     "updated_by" => 1,
        //                 ])
        //             )
        //             ->has(
        //                 CustomNotification::factory()
        //                     ->count(10)
        //                     ->state([
        //                         "receiver_id" => 1,
        //                         "created_by" => 1,
        //                         "updated_by" => 1,
        //                     ]),
        //                 'notificationsReceived' // 👈 match your relation name
        //             )
        //             ->has(
        //                 CustomNotification::factory()
        //                     ->count(3)
        //                     ->state([
        //                         "sender_id" => 1,
        //                         "created_by" => 1,
        //                         "updated_by" => 1,
        //                     ]),
        //                 'notificationsSended' // 👈 match your relation name
        //             )
        //     )
        //     ->has(
        //         Classe::factory()
        //             ->count(6)
        //             ->has(
        //                 Apprenant::factory()
        //                     ->count(5)
        //                     ->has(Interrogation::factory()->count(3))
        //                     ->has(Devoir::factory()->count(3))
        //                     ->has(Inscription::factory()->count(3))
        //                     ->has(Payement::factory()->count(3))
        //             )
        //             ->state([
        //                 "created_by" => 1,
        //                 "updated_by" => 1,
        //             ])
        //     )
        //     ->has(
        //         Matiere::factory()->count(5)
        //     )
        //     ->has(
        //         Trimestre::factory()->count(3)
        //     )
        //     ->create();
    }
}
