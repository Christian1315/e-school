<?php

use App\Models\User;
use App\Models\School;

test('user belongs to school', function () {
    $school = School::factory()->create();
    $user = User::factory()->create(['school_id' => $school->id]);

    expect($user->school()->exists())->toBeTrue();
    expect($user->school->id)->toBe($school->id);
});

test('user can have roles', function () {
    $user = User::factory()->create();

    expect(method_exists($user, 'roles'))->toBeTrue();
});

test('user can be soft deleted', function () {
    $user = User::factory()->create();

    $user->delete();

    assertSoftDeleted('users', ['id' => $user->id]);
});

test('user has email verification', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    expect($user->email_verified_at)->toBeNull();
});

test('user password is hashed', function () {
    $password = 'password123';
    $user = User::factory()->create(['password' => $password]);

    expect($user->password)->not->toBe($password);
});
