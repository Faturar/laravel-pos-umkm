<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'invoice_number' => 'INV-' . date('Ymd') . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'subtotal' => $this->faker->numberBetween(10000, 100000),
            'discount_amount' => $this->faker->numberBetween(0, 10000),
            'tax_amount' => $this->faker->numberBetween(0, 10000),
            'service_charge_amount' => $this->faker->numberBetween(0, 5000),
            'total_amount' => $this->faker->numberBetween(10000, 120000),
            'final_amount' => $this->faker->numberBetween(10000, 120000),
            'paid_amount' => $this->faker->numberBetween(10000, 150000),
            'change_amount' => $this->faker->numberBetween(0, 30000),
            'payment_method' => $this->faker->randomElement(['cash', 'qris', 'transfer', 'card']),
            'payment_reference' => $this->faker->optional()->numerify('REF-########'),
            'notes' => $this->faker->optional()->sentence(),
            'status' => $this->faker->randomElement(['pending', 'completed', 'voided', 'refunded']),
            'is_void' => false,
            'is_refund' => false,
            'void_reason' => null,
            'refund_reason' => null,
            'is_synced' => true,
            'cashier_id' => User::factory(),
            'customer_id' => null,
            'outlet_id' => Outlet::factory(),
        ];
    }

    /**
     * Indicate that the transaction is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the transaction is voided.
     */
    public function voided(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'voided',
            'is_void' => true,
            'void_reason' => 'Customer request',
        ]);
    }

    /**
     * Indicate that the transaction is refunded.
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refunded',
            'is_refund' => true,
            'refund_reason' => 'Product return',
        ]);
    }

    /**
     * Indicate that the transaction is not synced.
     */
    public function notSynced(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_synced' => false,
        ]);
    }
}