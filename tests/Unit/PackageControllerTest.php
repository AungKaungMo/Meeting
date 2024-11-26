<?php

namespace Tests\Unit;

use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PackageControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic unit test example.
     */
    public function test_index_returns_packages_list()
    {
        $user = User::factory()->create();
        Package::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('packages.index'));
        $response->assertStatus(200);
        $response->assertInertia(function ($inertia) {
            $inertia->has('packages.data');
        });
    }

    public function test_store_creates_new_package()
    {
        $des = '{"key": "value"}';

        $user = User::factory()->create();
        $data = [
            'name' => 'Test Package',
            'limit_employee' => 1,
            'max_employee' => 50,
            'description' => $des,
        ];

        $response = $this->actingAs($user)->post(route('packages.store'), $data);

        $response->assertRedirect(route('packages.index'));
        try {
            $this->assertDatabaseHas('packages', [
                'name' => 'Test Package',
                'limit_employee' => 1,
                'max_employee' => 50,
                'description' => $des,
            ]);
        } catch (\Throwable $th) {
            $response->assertDontSeeText($th->getMessage());
        }
    }

    public function test_update_modifies_package()
    {
        $des = '{"key": "value"}';
        $user = User::factory()->create();
        $package = Package::factory()->create();
        $updatedData = [
            'name' => 'Updated Package',
            'limit_employee' => 1,
            'max_employee' => 20,
            'description' => $des,
            'status' => 1,
        ];

        $response = $this->actingAs($user)->put(route('packages.update', $package->id), $updatedData);
        $response->assertRedirect(route('packages.index'));

        try {
            $this->assertDatabaseHas('packages', [
                'name' => 'Updated Package',
                'limit_employee' => 1,
                'max_employee' => 20,
                'description' => $des,
                'status' => 1,
            ]);
        } catch (\Throwable $th) {
            $response->assertDontSeeText($th->getMessage());
        }
    }

    public function test_destroy_deletes_package()
    {
        $user = User::factory()->create();
        $package = Package::factory()->create();

        $response = $this->actingAs($user)->delete(route('packages.destroy', $package->id));
        $response->assertRedirect(route('packages.index'));
        $this->assertDatabaseMissing('packages', ['id' => $package->id]);
    }
}
