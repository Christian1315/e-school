<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleControllerTest extends TestCase
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
    public function test_can_view_roles_list()
    {
        Role::factory()->count(3)->create(['school_id' => $this->school->id]);

        $response = $this->get(route('role.index'));

        $response->assertStatus(200);
        $response->assertViewHas('roles');
    }

    /** @test */
    public function test_can_view_create_role_page()
    {
        $response = $this->get(route('role.create'));

        $response->assertStatus(200);
    }

    /** @test */
    public function test_can_create_role()
    {
        $data = [
            'name' => 'Directeur',
        ];

        $response = $this->post(route('role.store'), $data);

        $response->assertRedirect(route('role.index'));
        $this->assertDatabaseHas('roles', ['name' => 'Directeur']);
    }

    /** @test */
    public function test_can_view_edit_role_page()
    {
        $role = Role::factory()->create(['school_id' => $this->school->id]);

        $response = $this->get(route('role.edit', $role));

        $response->assertStatus(200);
        $response->assertViewHas('role');
    }

    /** @test */
    public function test_can_update_role()
    {
        $role = Role::factory()->create(['school_id' => $this->school->id]);

        $data = ['name' => 'Administrateur Updated'];

        $response = $this->patch(route('role.update', $role), $data);

        $response->assertRedirect(route('role.index'));
        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Administrateur Updated']);
    }

    /** @test */
    public function test_can_delete_role()
    {
        $role = Role::factory()->create(['school_id' => $this->school->id]);

        $response = $this->delete(route('role.destroy', $role));

        $response->assertRedirect(route('role.index'));
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    /** @test */
    public function test_cannot_create_role_without_name()
    {
        $response = $this->post(route('role.store'), []);

        $response->assertSessionHasErrors('name');
    }

    /** @test */
    public function test_role_has_reference_on_creation()
    {
        $data = ['name' => 'Nouveau Role'];

        $this->post(route('role.store'), $data);

        $role = Role::where('name', 'Nouveau Role')->first();
        $this->assertNotNull($role->reference);
        $this->assertStringContainsString('RX-OOO', $role->reference);
    }
}
