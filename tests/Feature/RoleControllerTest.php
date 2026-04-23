<?php

use App\Models\Role;
use App\Models\School;
use App\Models\User;

beforeEach(function () {
    $this->school = School::factory()->create();
    $this->user = User::factory()->create(['school_id' => $this->school->id]);
    actingAs($this->user);
});

test('can view roles list', function () {
    Role::factory()->count(3)->create(['school_id' => $this->school->id]);

    $response = get(route('role.index'));

    $response->assertStatus(200);
    $response->assertViewHas('roles');
});

test('can view create role page', function () {
    $response = get(route('role.create'));

    $response->assertStatus(200);
});

test('can create role', function () {
    $data = [
        'name' => 'Directeur',
    ];

    $response = post(route('role.store'), $data);

    $response->assertRedirect(route('role.index'));
    assertDatabaseHas('roles', ['name' => 'Directeur']);
});

test('can view edit role page', function () {
    $role = Role::factory()->create(['school_id' => $this->school->id]);

    $response = get(route('role.edit', $role));

    $response->assertStatus(200);
    $response->assertViewHas('role');
});

test('can update role', function () {
    $role = Role::factory()->create(['school_id' => $this->school->id]);

    $data = ['name' => 'Administrateur Updated'];

    $response = patch(route('role.update', $role), $data);

    $response->assertRedirect(route('role.index'));
    assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Administrateur Updated']);
});

test('can delete role', function () {
    $role = Role::factory()->create(['school_id' => $this->school->id]);

    $response = delete(route('role.destroy', $role));

    $response->assertRedirect(route('role.index'));
    assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('cannot create role without name', function () {
    $response = post(route('role.store'), []);

    $response->assertSessionHasErrors('name');
});

test('role has reference on creation', function () {
    $data = ['name' => 'Nouveau Role'];

    post(route('role.store'), $data);

    $role = Role::where('name', 'Nouveau Role')->first();
    expect($role->reference)->not->toBeNull();
    expect($role->reference)->toContain('RX-OOO');
});
