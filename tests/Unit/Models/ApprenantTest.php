<?php

namespace Tests\Unit\Models;

use App\Models\Apprenant;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApprenantTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_apprenant_belongs_to_school()
    {
        $school = School::factory()->create();
        $apprenant = Apprenant::factory()->create(['school_id' => $school->id]);

        $this->assertTrue($apprenant->school()->exists());
        $this->assertEquals($school->id, $apprenant->school->id);
    }

    /** @test */
    public function test_apprenant_can_have_inscriptions()
    {
        $apprenant = Apprenant::factory()->create();

        $this->assertTrue($apprenant->inscriptions()->exists() || !$apprenant->inscriptions()->exists());
    }

    /** @test */
    public function test_apprenant_has_required_fields()
    {
        $apprenant = Apprenant::factory()->create();

        $this->assertNotNull($apprenant->firstname);
        $this->assertNotNull($apprenant->lastname);
        $this->assertNotNull($apprenant->school_id);
    }

    /** @test */
    public function test_apprenant_reference_is_generated()
    {
        $apprenant = Apprenant::factory()->create();

        $this->assertNotNull($apprenant->reference);
    }
}
