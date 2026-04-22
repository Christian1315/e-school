<?php

namespace Tests\Feature;

use App\Models\Apprenant;
use App\Models\Payement;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayementControllerTest extends TestCase
{
    use RefreshDatabase;

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
    public function test_can_view_payements_list()
    {
        Payement::factory()->count(3)->create(['school_id' => $this->school->id]);

        $response = $this->get(route('paiement.index'));

        $response->assertStatus(200);
        $response->assertViewHas('payements');
    }

    /** @test */
    public function test_can_view_create_payement_page()
    {
        $response = $this->get(route('paiement.create'));

        $response->assertStatus(200);
        $response->assertViewHas('apprenants');
    }

    /** @test */
    public function test_can_create_payement()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'montant' => 25000,
            'date_paiement' => now()->toDateString(),
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('paiement.store'), $data);

        $response->assertRedirect(route('paiement.index'));
        $this->assertDatabaseHas('payements', ['montant' => 25000]);
    }

    /** @test */
    public function test_can_view_edit_payement_page()
    {
        $payement = Payement::factory()->create(['school_id' => $this->school->id]);

        $response = $this->get(route('paiement.edit', $payement));

        $response->assertStatus(200);
        $response->assertViewHas('paiement');
    }

    /** @test */
    public function test_can_update_payement()
    {
        $payement = Payement::factory()->create(['school_id' => $this->school->id]);

        $data = [
            'apprenant_id' => $this->apprenant->id,
            'montant' => 35000,
            'date_paiement' => now()->toDateString(),
            'annee_scolaire' => 2024,
        ];

        $response = $this->patch(route('paiement.update', $payement), $data);

        $response->assertRedirect(route('paiement.index'));
        $this->assertDatabaseHas('payements', ['id' => $payement->id, 'montant' => 35000]);
    }

    /** @test */
    public function test_can_delete_payement()
    {
        $payement = Payement::factory()->create(['school_id' => $this->school->id]);

        $response = $this->delete(route('paiement.destroy', $payement));

        $response->assertRedirect(route('paiement.index'));
        $this->assertDatabaseMissing('payements', ['id' => $payement->id]);
    }

    /** @test */
    public function test_cannot_create_payement_without_montant()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'date_paiement' => now()->toDateString(),
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('paiement.store'), $data);

        $response->assertSessionHasErrors('montant');
    }

    /** @test */
    public function test_cannot_create_payement_with_invalid_montant()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'montant' => 'invalid',
            'date_paiement' => now()->toDateString(),
            'annee_scolaire' => 2024,
        ];

        $response = $this->post(route('paiement.store'), $data);

        $response->assertSessionHasErrors('montant');
    }

    /** @test */
    public function test_payement_has_reference_on_creation()
    {
        $data = [
            'apprenant_id' => $this->apprenant->id,
            'montant' => 25000,
            'date_paiement' => now()->toDateString(),
            'annee_scolaire' => 2024,
        ];

        $this->post(route('paiement.store'), $data);

        $payement = Payement::where('montant', 25000)->first();
        $this->assertNotNull($payement->reference);
        $this->assertStringContainsString('PAY-', $payement->reference);
    }
}
