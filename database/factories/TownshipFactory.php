<?php

namespace Database\Factories;

use App\Models\RegionState;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Township>
 */
class TownshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->city,
            'region_state_id' => RegionState::factory(),
            'status' => $this->faker->randomElement([0, 1]),
        ];
    }
}
