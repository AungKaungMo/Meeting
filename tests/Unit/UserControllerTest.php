<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase; // Automatically rollback changes after each test

    /**
     * Test the index method to ensure the users list is returned.
     *
     * @return void
     */
    public function test_index_returns_users_list()
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs(User::first())->get(route('users.index'));

        $response->assertStatus(200);

        $response->assertInertia(function ($inertia) {
            $inertia->has('users.data');
        });
    }

    /**
     * Test the store method to create a new user.
     *
     * @return void
     */
    public function test_store_creates_new_user()
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'photo' => null,
        ];

        $response = $this->actingAs($user)->post(route('users.store'), $data);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    /**
     * Test the update method to modify an existing user.
     *
     * @return void
     */
    public function test_update_modifies_user()
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'photo' => null,
        ];

        $response = $this->actingAs(User::first())->put(route('users.update', $user->id), $data);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', ['email' => 'updated@example.com', 'name' => 'Updated Name']);
    }

    /**
     * Test the destroy method to delete a user.
     *
     * @return void
     */
    public function test_destroy_deletes_user()
    {
        $user = User::factory()->create();

        $response = $this->actingAs(User::first())->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
