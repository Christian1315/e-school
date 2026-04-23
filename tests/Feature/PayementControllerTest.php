<?php

use App\Models\Apprenant;
use App\Models\Payement;
use App\Models\School;
use App\Models\User;

beforeEach(function () {
    $this->school = School::factory()->create();
    $this->user = User::factory()->create(['school_id' => $this->school->id]);
    $this->apprenant = Apprenant::factory()->create(['school_id' => $this->school->id]);
    actingAs($this->user);
});

test('can view payements list', function () {
    Payement::factory()->count(3)->create(['school_id' => $this->school->id]);

    $response = get(route('paiement.index'));

    $response->assertStatus(200);
    $response->assertViewHas('payements');
});

test('can view create payement page', function () {
    $response = get(route('paiement.create'));

    $response->assertStatus(200);
    $response->assertViewHas('apprenants');
});

test('can create payement', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'montant' => 25000,
        'date_paiement' => now()->toDateString(),
        'annee_scolaire' => 2024,
    ];

    $response = post(route('paiement.store'), $data);

    $response->assertRedirect(route('paiement.index'));
    assertDatabaseHas('payements', ['montant' => 25000]);
});

test('can view edit payement page', function () {
    $payement = Payement::factory()->create(['school_id' => $this->school->id]);

    $response = get(route('paiement.edit', $payement));

    $response->assertStatus(200);
    $response->assertViewHas('paiement');
});

test('can update payement', function () {
    $payement = Payement::factory()->create(['school_id' => $this->school->id]);

    $data = [
        'apprenant_id' => $this->apprenant->id,
        'montant' => 35000,
        'date_paiement' => now()->toDateString(),
        'annee_scolaire' => 2024,
    ];

    $response = patch(route('paiement.update', $payement), $data);

    $response->assertRedirect(route('paiement.index'));
    assertDatabaseHas('payements', ['id' => $payement->id, 'montant' => 35000]);
});

test('can delete payement', function () {
    $payement = Payement::factory()->create(['school_id' => $this->school->id]);

    $response = delete(route('paiement.destroy', $payement));

    $response->assertRedirect(route('paiement.index'));
    assertDatabaseMissing('payements', ['id' => $payement->id]);
});

test('cannot create payement without montant', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'date_paiement' => now()->toDateString(),
        'annee_scolaire' => 2024,
    ];

    $response = post(route('paiement.store'), $data);

    $response->assertSessionHasErrors('montant');
});

test('cannot create payement with invalid montant', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'montant' => 'invalid',
        'date_paiement' => now()->toDateString(),
        'annee_scolaire' => 2024,
    ];

    $response = post(route('paiement.store'), $data);

    $response->assertSessionHasErrors('montant');
});

test('payement has reference on creation', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'montant' => 25000,
        'date_paiement' => now()->toDateString(),
        'annee_scolaire' => 2024,
    ];

    post(route('paiement.store'), $data);

    $payement = Payement::where('montant', 25000)->first();
    expect($payement->reference)->not->toBeNull();
    expect($payement->reference)->toContain('PAY-');
});
