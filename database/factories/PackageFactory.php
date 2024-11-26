<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'limit_employee' => $this->faker->boolean(),
            'max_employee' => $this->faker->boolean() ? $this->faker->numberBetween(10, 50) : null,
            'description' => json_encode([
                'key' => $this->faker->sentence(),
                'value' => $this->faker->sentence(),
            ]),
            'status' => $this->faker->boolean(),
        ];
    }
}
