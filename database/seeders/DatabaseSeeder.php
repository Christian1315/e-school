<?php

namespace Database\Seeders;

use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\CustomNotification;
use App\Models\Detail;
use App\Models\Devoir;
use App\Models\Inscription;
use App\Models\Interrogation;
use App\Models\Matiere;
use App\Models\MoyenneDevoir;
use App\Models\MoyenneInterrogation;
use App\Models\Notification;
use App\Models\Payement;
use App\Models\School;
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
        // User::factory(10)->create();

        User::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'E-school',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'), // mot de passe par défaut
        ]);

        /**
         * School Seed
         */
        $schools = School::factory()
            ->count(3)
            ->has(
                User::factory()
                    ->count(10)
                    ->has(
                        Detail::factory()->state([
                            "created_by" => 1,
                            "updated_by" => 1,
                        ])
                    )
                    ->has(
                        CustomNotification::factory()
                            ->count(10)
                            ->state([
                                "receiver_id" => 1,
                                "created_by" => 1,
                                "updated_by" => 1,
                            ]),
                        'notificationsReceived' // 👈 match your relation name
                    )
                    ->has(
                        CustomNotification::factory()
                            ->count(3)
                            ->state([
                                "sender_id" => 1,
                                "created_by" => 1,
                                "updated_by" => 1,
                            ]),
                        'notificationsSended' // 👈 match your relation name
                    )
            )
            ->has(
                Classe::factory()
                    ->count(6)
                    ->has(
                        Apprenant::factory()
                            ->count(5)
                            ->has(Interrogation::factory()->count(3))
                            ->has(Devoir::factory()->count(3))
                            ->has(Inscription::factory()->count(3))
                            ->has(Payement::factory()->count(3))
                    )
                    ->state([
                        "created_by" => 1,
                        "updated_by" => 1,
                    ])
            )
            ->has(
                Matiere::factory()->count(5)
            )
            ->has(
                Trimestre::factory()->count(3)
            )
            ->create();
    }
}
