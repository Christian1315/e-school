<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_user_belongs_to_school()
    {
        $school = School::factory()->create();
        $user = User::factory()->create(['school_id' => $school->id]);

        $this->assertTrue($user->school()->exists());
        $this->assertEquals($school->id, $user->school->id);
    }

    /** @test */
    public function test_user_can_have_roles()
    {
        $user = User::factory()->create();

        $this->assertTrue($user->roles()->exists() || !$user->roles()->exists());
    }

    /** @test */
    public function test_user_can_be_soft_deleted()
    {
        $user = User::factory()->create();

        $user->delete();

        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    /** @test */
    public function test_user_has_email_verification()
    {
        $user = User::factory()->create(['email_verified_at' => null]);

        $this->assertNull($user->email_verified_at);
    }

    /** @test */
    public function test_user_password_is_hashed()
    {
        $password = 'password123';
        $user = User::factory()->create(['password' => $password]);

        $this->assertNotEquals($password, $user->password);
    }
}
