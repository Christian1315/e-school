<?php

use App\Models\Apprenant;
use App\Models\School;

test('apprenant belongs to school', function () {
    $school = School::factory()->create();
    $apprenant = Apprenant::factory()->create(['school_id' => $school->id]);

    expect($apprenant->school()->exists())->toBeTrue();
    expect($apprenant->school->id)->toBe($school->id);
});

test('apprenant can have inscriptions', function () {
    $apprenant = Apprenant::factory()->create();

    // This test is a bit vague, perhaps check the relationship
    expect(method_exists($apprenant, 'inscriptions'))->toBeTrue();
});

test('apprenant has required fields', function () {
    $apprenant = Apprenant::factory()->create();

    expect($apprenant->firstname)->not->toBeNull();
    expect($apprenant->lastname)->not->toBeNull();
    expect($apprenant->school_id)->not->toBeNull();
});

test('apprenant reference is generated', function () {
    $apprenant = Apprenant::factory()->create();

    expect($apprenant->reference)->not->toBeNull();
});
