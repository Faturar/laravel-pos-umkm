<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->optional()->sentence(),
            'outlet_id' => Outlet::factory(),
        ];
    }

    /**
     * Indicate that the category has a specific outlet.
     */
    public function withOutlet(Outlet $outlet): static
    {
        return $this->state(fn (array $attributes) => [
            'outlet_id' => $outlet->id,
        ]);
    }
}