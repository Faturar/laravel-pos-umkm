<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

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
            'price' => $this->faker->numberBetween(10000, 100000),
            'cost' => $this->faker->numberBetween(5000, 80000),
            'sku' => $this->faker->unique()->numerify('PRD-########'),
            'barcode' => $this->faker->optional()->numerify('###############'),
            'image' => null,
            'is_active' => true,
            'track_stock' => true,
            'stock_quantity' => $this->faker->numberBetween(50, 100),
            'stock_alert_threshold' => $this->faker->numberBetween(1, 10),
            'category_id' => Category::factory(),
            'outlet_id' => Outlet::factory(),
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product does not track stock.
     */
    public function noStockTracking(): static
    {
        return $this->state(fn (array $attributes) => [
            'track_stock' => false,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $attributes['stock_alert_threshold'],
        ]);
    }

    /**
     * Indicate that the product has a specific category.
     */
    public function withCategory(Category $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
            'outlet_id' => $category->outlet_id,
        ]);
    }

    /**
     * Indicate that the product has a specific outlet.
     */
    public function withOutlet(Outlet $outlet): static
    {
        return $this->state(fn (array $attributes) => [
            'outlet_id' => $outlet->id,
        ]);
    }
}