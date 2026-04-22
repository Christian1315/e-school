<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected School $school;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::factory()->create();
        $this->user = User::factory()->create(['school_id' => $this->school->id]);
        $this->actingAs($this->user);
    }

    /** @test */
    public function test_can_view_users_list()
    {
        $response = $this->get(route('user.index'));

        $response->assertStatus(200);
        $response->assertViewHas('users');
    }

    /** @test */
    public function test_can_view_create_user_page()
    {
        $response = $this->get(route('user.create'));

        $response->assertStatus(200);
        $response->assertViewHas('roles');
    }

    /** @test */
    public function test_can_create_user()
    {
        $role = Role::factory()->create(['school_id' => $this->school->id]);

        $data = [
            'firstname' => 'Jean',
            'lastname' => 'Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => $role->id,
        ];

        $response = $this->post(route('user.store'), $data);

        $response->assertRedirect(route('user.index'));
        $this->assertDatabaseHas('users', ['email' => 'jean.dupont@example.com']);
    }

    /** @test */
    public function test_can_view_edit_user_page()
    {
        $userToEdit = User::factory()->create(['school_id' => $this->school->id]);

        $response = $this->get(route('user.edit', $userToEdit));

        $response->assertStatus(200);
        $response->assertViewHas('user');
    }

    /** @test */
    public function test_can_update_user()
    {
        $userToEdit = User::factory()->create(['school_id' => $this->school->id]);

        $data = [
            'firstname' => 'Jean Updated',
            'lastname' => 'Dupont Updated',
            'email' => 'jean.updated@example.com',
        ];

        $response = $this->patch(route('user.update', $userToEdit), $data);

        $response->assertRedirect(route('user.index'));
        $this->assertDatabaseHas('users', ['id' => $userToEdit->id, 'firstname' => 'Jean Updated']);
    }

    /** @test */
    public function test_can_delete_user()
    {
        $userToDelete = User::factory()->create(['school_id' => $this->school->id]);

        $response = $this->delete(route('user.destroy', $userToDelete));

        $response->assertRedirect(route('user.index'));
        $this->assertSoftDeleted('users', ['id' => $userToDelete->id]);
    }

    /** @test */
    public function test_cannot_create_user_with_invalid_email()
    {
        $data = [
            'firstname' => 'Jean',
            'lastname' => 'Dupont',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post(route('user.store'), $data);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function test_can_get_parents_list()
    {
        User::factory()->count(2)->create(['school_id' => $this->school->id]);

        $response = $this->get(route('user.parents'));

        $response->assertStatus(200);
        $response->assertViewHas('apprenants');
    }

    /** @test */
    public function test_can_get_professors_list()
    {
        User::factory()->count(2)->create(['school_id' => $this->school->id]);

        $response = $this->get(route('user.professeurs'));

        $response->assertStatus(200);
        $response->assertViewHas('apprenants');
    }
}
