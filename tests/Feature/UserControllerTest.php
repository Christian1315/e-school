<?php

use App\Models\Role;
use App\Models\School;
use App\Models\User;

beforeEach(function () {
    $this->school = School::factory()->create();
    $this->user = User::factory()->create(['school_id' => $this->school->id]);
    actingAs($this->user);
});

test('can view users list', function () {
    $response = get(route('user.index'));

    $response->assertStatus(200);
    $response->assertViewHas('users');
});

test('can view create user page', function () {
    $response = get(route('user.create'));

    $response->assertStatus(200);
    $response->assertViewHas('roles');
});

test('can create user', function () {
    $role = Role::factory()->create(['school_id' => $this->school->id]);

    $data = [
        'firstname' => 'Jean',
        'lastname' => 'Dupont',
        'email' => 'jean.dupont@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role_id' => $role->id,
    ];

    $response = post(route('user.store'), $data);

    $response->assertRedirect(route('user.index'));
    assertDatabaseHas('users', ['email' => 'jean.dupont@example.com']);
});

test('can view edit user page', function () {
    $userToEdit = User::factory()->create(['school_id' => $this->school->id]);

    $response = get(route('user.edit', $userToEdit));

    $response->assertStatus(200);
    $response->assertViewHas('user');
});

test('can update user', function () {
    $userToEdit = User::factory()->create(['school_id' => $this->school->id]);

    $data = [
        'firstname' => 'Jean Updated',
        'lastname' => 'Dupont Updated',
        'email' => 'jean.updated@example.com',
    ];

    $response = patch(route('user.update', $userToEdit), $data);

    $response->assertRedirect(route('user.index'));
    assertDatabaseHas('users', ['id' => $userToEdit->id, 'firstname' => 'Jean Updated']);
});

test('can delete user', function () {
    $userToDelete = User::factory()->create(['school_id' => $this->school->id]);

    $response = delete(route('user.destroy', $userToDelete));

    $response->assertRedirect(route('user.index'));
    assertSoftDeleted('users', ['id' => $userToDelete->id]);
});

test('cannot create user with invalid email', function () {
    $data = [
        'firstname' => 'Jean',
        'lastname' => 'Dupont',
        'email' => 'invalid-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = post(route('user.store'), $data);

    $response->assertSessionHasErrors('email');
});

test('can get parents list', function () {
    User::factory()->count(2)->create(['school_id' => $this->school->id]);

    $response = get(route('user.parents'));

    $response->assertStatus(200);
    $response->assertViewHas('apprenants');
});

test('can get professors list', function () {
    User::factory()->count(2)->create(['school_id' => $this->school->id]);

    $response = get(route('user.professeurs'));

    $response->assertStatus(200);
    $response->assertViewHas('apprenants');
});
