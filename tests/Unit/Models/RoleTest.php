<?php

use App\Models\Role;
use App\Models\School;
use App\Models\User;

test('role belongs to school', function () {
    $school = School::factory()->create();
    $role = Role::factory()->create(['school_id' => $school->id]);

    expect($role->school()->exists())->toBeTrue();
    expect($role->school->id)->toBe($school->id);
});

test('role has many permissions', function () {
    $role = Role::factory()->create();

    expect(method_exists($role, 'permissions'))->toBeTrue();
});

test('role can have users', function () {
    $role = Role::factory()->create();
    $user = User::factory()->create();

    $user->assignRole($role);

    expect($role->users()->exists())->toBeTrue();
});

test('role reference is generated', function () {
    $school = School::factory()->create();
    $role = Role::factory()->create(['school_id' => $school->id]);

    expect($role->reference)->not->toBeNull();
    expect($role->reference)->toContain('RX-OOO');
});

test('role is assigned to school on creation', function () {
    $school = School::factory()->create();

    $role = Role::create([
        'name' => 'Test Role',
        'school_id' => $school->id,
    ]);

    expect($role->school_id)->toBe($school->id);
});
