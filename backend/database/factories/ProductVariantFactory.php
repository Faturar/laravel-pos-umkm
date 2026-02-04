<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

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
            'sku' => $this->faker->unique()->numerify('VAR-########'),
            'barcode' => $this->faker->optional()->numerify('###############'),
            'is_active' => true,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'stock_alert_threshold' => $this->faker->numberBetween(1, 10),
            'product_id' => Product::factory(),
        ];
    }

    /**
     * Indicate that the product variant is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product variant is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product variant has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $attributes['stock_alert_threshold'],
        ]);
    }

    /**
     * Indicate that the product variant has a specific product.
     */
    public function withProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
        ]);
    }
}