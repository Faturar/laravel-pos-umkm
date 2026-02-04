<?php

namespace Database\Factories;

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['in', 'out', 'adjustment']);
        $quantity = $this->faker->numberBetween(1, 10);
        
        return [
            'type' => $type,
            'quantity' => $quantity,
            'before_quantity' => $this->faker->numberBetween(0, 100),
            'after_quantity' => $this->faker->numberBetween(0, 100),
            'notes' => $this->faker->optional()->sentence(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'transaction_id' => null,
            'user_id' => User::factory(),
            'outlet_id' => Outlet::factory(),
        ];
    }

    /**
     * Indicate that the stock movement is type 'in'.
     */
    public function in(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'in',
        ]);
    }

    /**
     * Indicate that the stock movement is type 'out'.
     */
    public function out(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'out',
        ]);
    }

    /**
     * Indicate that the stock movement is type 'adjustment'.
     */
    public function adjustment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'adjustment',
        ]);
    }

    /**
     * Indicate that the stock movement has a product variant.
     */
    public function withVariant(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_variant_id' => ProductVariant::factory(),
        ]);
    }

    /**
     * Indicate that the stock movement is associated with a transaction.
     */
    public function fromTransaction(): static
    {
        return $this->state(fn (array $attributes) => [
            'transaction_id' => Transaction::factory(),
        ]);
    }

    /**
     * Indicate that the stock movement has a specific product.
     */
    public function withProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
            'outlet_id' => $product->outlet_id,
        ]);
    }

    /**
     * Indicate that the stock movement has a specific product variant.
     */
    public function withProductVariant(ProductVariant $variant): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'outlet_id' => $variant->product->outlet_id,
        ]);
    }
}