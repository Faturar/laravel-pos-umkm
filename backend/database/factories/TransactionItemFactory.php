<?php

namespace Database\Factories;

use App\Models\TransactionItem;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionItem>
 */
class TransactionItemFactory extends Factory
{
    protected $model = TransactionItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'price' => $this->faker->numberBetween(10000, 50000),
            'cost' => $this->faker->numberBetween(5000, 25000),
            'quantity' => $this->faker->numberBetween(1, 10),
            'discount_amount' => $this->faker->numberBetween(0, 5000),
            'tax_amount' => $this->faker->numberBetween(0, 5000),
            'subtotal' => $this->faker->numberBetween(10000, 50000),
            'notes' => $this->faker->optional()->sentence(),
            'transaction_id' => Transaction::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
        ];
    }

    /**
     * Indicate that the transaction item has a product variant.
     */
    public function withVariant(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_variant_id' => ProductVariant::factory(),
        ]);
    }

    /**
     * Indicate that the transaction item has a specific product.
     */
    public function withProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
            'price' => $product->price,
            'cost' => $product->cost,
        ]);
    }

    /**
     * Indicate that the transaction item has a specific product variant.
     */
    public function withProductVariant(ProductVariant $variant): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'price' => $variant->price,
            'cost' => $variant->cost,
        ]);
    }
}