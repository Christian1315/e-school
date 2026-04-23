<?php

use App\Models\Apprenant;
use App\Models\Inscription;
use App\Models\School;
use App\Models\User;

beforeEach(function () {
    $this->school = School::factory()->create();
    $this->user = User::factory()->create(['school_id' => $this->school->id]);
    $this->apprenant = Apprenant::factory()->create(['school_id' => $this->school->id]);
    actingAs($this->user);
});

test('can view inscriptions list', function () {
    Inscription::factory()->count(3)->create(['school_id' => $this->school->id]);

    $response = get(route('inscription.index'));

    $response->assertStatus(200);
    $response->assertViewHas('inscriptions');
});

test('can view create inscription page', function () {
    $response = get(route('inscription.create'));

    $response->assertStatus(200);
    $response->assertViewHas('apprenants');
});

test('can create inscription', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'numero_educ_master' => 'NEM-2024-001',
        'frais_inscription' => 50000,
        'annee_scolaire' => 2024,
    ];

    $response = post(route('inscription.store'), $data);

    $response->assertRedirect(route('inscription.index'));
    assertDatabaseHas('inscriptions', ['numero_educ_master' => 'NEM-2024-001']);
});

test('can view edit inscription page', function () {
    $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

    $response = get(route('inscription.edit', $inscription));

    $response->assertStatus(200);
    $response->assertViewHas('inscription');
});

test('can update inscription', function () {
    $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

    $data = [
        'apprenant_id' => $this->apprenant->id,
        'numero_educ_master' => 'NEM-2024-UPDATE',
        'frais_inscription' => 60000,
        'annee_scolaire' => 2024,
    ];

    $response = patch(route('inscription.update', $inscription), $data);

    $response->assertRedirect(route('inscription.index'));
    assertDatabaseHas('inscriptions', ['numero_educ_master' => 'NEM-2024-UPDATE']);
});

test('can delete inscription', function () {
    $inscription = Inscription::factory()->create(['school_id' => $this->school->id]);

    $response = delete(route('inscription.destroy', $inscription));

    $response->assertRedirect(route('inscription.index'));
    assertDatabaseMissing('inscriptions', ['id' => $inscription->id]);
});

test('cannot create inscription without apprenant', function () {
    $data = [
        'numero_educ_master' => 'NEM-2024-001',
        'frais_inscription' => 50000,
        'annee_scolaire' => 2024,
    ];

    $response = post(route('inscription.store'), $data);

    $response->assertSessionHasErrors('apprenant_id');
});

test('cannot create inscription with invalid frais', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'numero_educ_master' => 'NEM-2024-001',
        'frais_inscription' => 'invalid',
        'annee_scolaire' => 2024,
    ];

    $response = post(route('inscription.store'), $data);

    $response->assertSessionHasErrors('frais_inscription');
});

test('inscription has reference on creation', function () {
    $data = [
        'apprenant_id' => $this->apprenant->id,
        'numero_educ_master' => 'NEM-2024-001',
        'frais_inscription' => 50000,
        'annee_scolaire' => 2024,
    ];

    post(route('inscription.store'), $data);

    $inscription = Inscription::where('numero_educ_master', 'NEM-2024-001')->first();
    expect($inscription->reference)->not->toBeNull();
});
