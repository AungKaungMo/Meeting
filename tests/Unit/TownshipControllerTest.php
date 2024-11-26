<?php

namespace Tests\Feature;

use App\Models\Township;
use App\Models\RegionState;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TownshipControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_townships_list()
    {
        $user = User::factory()->create();
        $regionState = RegionState::factory()->create();
        Township::factory()->create(['region_state_id' => $regionState->id]);

        $response = $this->actingAs($user)->get(route('townships.index'));
        $response->assertStatus(200)
            ->assertInertia(fn($inertia) => $inertia->has('townships.data'));
    }

    public function test_store_creates_new_township()
    {
        $user = User::factory()->create();
        $regionState = RegionState::factory()->create();

        $data = [
            'name' => 'New Township',
            'region_state_id' => $regionState->id,
        ];
        $response = $this->actingAs($user)->post(route('townships.store'), $data);
        $response->assertRedirect(route('townships.index'));
        $this->assertDatabaseHas('townships', ['name' => 'New Township']);
    }

    public function test_update_modifies_township()
    {
        $user = User::factory()->create();
        $regionState = RegionState::factory()->create();
        $township = Township::factory()->create(['region_state_id' => $regionState->id]);
        $updatedData = [
            'name' => 'Updated Township',
            'region_state_id' => $regionState->id,
            'status' => 1,
        ];

        $response = $this->actingAs($user)->put(route('townships.update', $township->id), $updatedData);
        $response->assertRedirect(route('townships.index'));
        $this->assertDatabaseHas('townships', ['name' => 'Updated Township']);
    }

    public function test_destroy_deletes_township()
    {
        $user = User::factory()->create();
        $township = Township::factory()->create();
        $response = $this->actingAs($user)->delete(route('townships.destroy', $township->id));

        $response->assertRedirect(route('townships.index'));
        $this->assertDatabaseMissing('townships', ['id' => $township->id]);
    }
}
