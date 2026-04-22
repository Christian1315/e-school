<?php

namespace Tests\Feature;

use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class InscriptionControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected School $school;
    protected Apprenant $apprenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::factory()->create();
        $this->user = User::factory()->create(['school_id' => $this->school->id]);
        $this->apprenant = Apprenant::factory()->create(['school_id' => $this->school->id]);
        $this->actingAs($this->user);
    }

    /** @test */
    public function test_can_view_inscriptions_list()
    {
        Inscription::factory()->count(3)->create(['school_id' => $this->school->id]);

        $response = $this->get(route('inscription.index'));

        $response->assertStatus(200);
        $response->assertViewHas('inscriptions');
    }

    /** @test */
    public function test_can_view_create_inscription_page()
    {
        $response = $this->get(route('inscription.create'));

        $response->assertStatus(200);
        $response->assertViewHas('apprenants');
    }

    /** @test */
    public function test_can_create_inscription()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'numero_educ_master' => 'NEM-2024-001',
            'frais_inscription' => 50000,
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('inscription.store'), $data);

        $response->assertRedirect(route('inscription.index'));
        $this->assertDatabaseHas('inscriptions', ['numero_educ_master' => 'NEM-2024-001']);
    }

    /** @test */
    public function test_can_view_edit_inscription_page()
    {
        $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

        $response = $this->get(route('inscription.edit', $inscription));

        $response->assertStatus(200);
        $response->assertViewHas('inscription');
    }

    /** @test */
    public function test_can_update_inscription()
    {
        $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

        $data = [
            'apprenant_id' => $this->apprenant->id,
            'numero_educ_master' => 'NEM-2024-UPDATE',
            'frais_inscription' => 60000,
            'annee_scolaire' => 2024,
        ];

        $response = $this->patch(route('inscription.update', $inscription), $data);

        $response->assertRedirect(route('inscription.index'));
        $this->assertDatabaseHas('inscriptions', ['numero_educ_master' => 'NEM-2024-UPDATE']);
    }

    /** @test */
    public function test_can_delete_inscription()
    {
        $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

        $response = $this->delete(route('inscription.destroy', $inscription));

        $response->assertRedirect(route('inscription.index'));
        $this->assertDatabaseMissing('inscriptions', ['id' => $inscription->id]);
    }

    /** @test */
    public function test_cannot_create_inscription_without_apprenant()
    {
        $data = [
            'numero_educ_master' => 'NEM-2024-001',
            'frais_inscription' => 50000,
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('inscription.store'), $data);

        $response->assertSessionHasErrors('apprenant_id');
    }

    /** @test */
    public function test_cannot_create_inscription_with_invalid_frais()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'numero_educ_master' => 'NEM-2024-001',
            'frais_inscription' => 'invalid',
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('inscription.store'), $data);

        $response->assertSessionHasErrors('frais_inscription');
    }

    /** @test */
    public function test_inscription_has_reference_on_creation()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'numero_educ_master' => 'NEM-2024-001',
            'frais_inscription' => 50000,
            'annee_scolaire' => 2024,
        ];

        $this->post(route('inscription.store'), $data);

        $inscription = Inscription::where('numero_educ_master', 'NEM-2024-001')->first();
        $this->assertNotNull($inscription->reference);
    }
}
