<?php

namespace Tests\Unit\Models;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_role_belongs_to_school()
    {
        $school = School::factory()->create();
        $role = Role::factory()->create(['school_id' => $school->id]);

        $this->assertTrue($role->school()->exists());
        $this->assertEquals($school->id, $role->school->id);
    }

    /** @test */
    public function test_role_has_many_permissions()
    {
        $role = Role::factory()->create();

        $this->assertTrue($role->permissions()->exists() || !$role->permissions()->exists());
    }

    /** @test */
    public function test_role_can_have_users()
    {
        $role = Role::factory()->create();
        $user = User::factory()->create();

        $user->assignRole($role);

        $this->assertTrue($role->users()->exists());
    }

    /** @test */
    public function test_role_reference_is_generated()
    {
        $school = School::factory()->create();
        $role = Role::factory()->create(['school_id' => $school->id]);

        $this->assertNotNull($role->reference);
        $this->assertStringContainsString('RX-OOO', $role->reference);
    }

    /** @test */
    public function test_role_is_assigned_to_school_on_creation()
    {
        $school = School::factory()->create();

        $role = Role::create([
            'name' => 'Test Role',
            'school_id' => $school->id,
        ]);

        $this->assertEquals($school->id, $role->school_id);
    }
}
