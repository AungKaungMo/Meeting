<?php

namespace Tests\Feature;

use App\Models\RegionState;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionAndStateControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_region_states_list()
    {
        RegionState::factory()->count(3)->create();

        $response = $this->actingAs(User::factory()->create())->get(route('region-states.index'));

        $response->assertStatus(200);
        $response->assertInertia(function ($inertia) {
            $inertia->has('region_states.data');
        });
    }

    public function test_store_creates_new_region_state()
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'New Region',
            'status' => 1,
        ];

        $response = $this->actingAs($user)->post(route('region-states.store'), $data);

        $response->assertRedirect(route('region-states.index'));
        $this->assertDatabaseHas('region_states', ['name' => 'New Region']);
    }

    public function test_update_modifies_region_state()
    {
        $regionState = RegionState::factory()->create();
        $user = User::factory()->create();

        $data = [
            'name' => 'Updated Region',
            'status' => 1,
        ];

        $response = $this->actingAs($user)->put(route('region-states.update', $regionState->id), $data);

        $response->assertRedirect(route('region-states.index'));
        $this->assertDatabaseHas('region_states', ['name' => 'Updated Region']);
    }

    public function test_destroy_deletes_region_state()
    {
        $regionState = RegionState::factory()->create();
        $user = User::factory()->create();
        $response = $this->actingAs($user)->delete(route('region-states.destroy', $regionState->id));

        $response->assertRedirect(route('region-states.index'));
        $this->assertDatabaseMissing('region_states', ['id' => $regionState->id]);
    }
}
