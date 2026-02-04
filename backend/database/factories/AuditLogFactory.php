<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'action' => $this->faker->randomElement(['create', 'update', 'delete', 'void', 'refund']),
            'model_type' => $this->faker->randomElement(['Transaction', 'Product', 'Category']),
            'model_id' => $this->faker->numberBetween(1, 100),
            'old_values' => null,
            'new_values' => null,
            'user_id' => User::factory(),
            'outlet_id' => Outlet::factory(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
        ];
    }

    /**
     * Indicate that the audit log is for a transaction.
     */
    public function forTransaction(): static
    {
        return $this->state(fn (array $attributes) => [
            'model_type' => 'Transaction',
        ]);
    }

    /**
     * Indicate that the audit log is for a product.
     */
    public function forProduct(): static
    {
        return $this->state(fn (array $attributes) => [
            'model_type' => 'Product',
        ]);
    }

    /**
     * Indicate that the audit log is for a category.
     */
    public function forCategory(): static
    {
        return $this->state(fn (array $attributes) => [
            'model_type' => 'Category',
        ]);
    }

    /**
     * Indicate that the audit log is for a void action.
     */
    public function forVoid(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'void',
        ]);
    }

    /**
     * Indicate that the audit log is for a refund action.
     */
    public function forRefund(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'refund',
        ]);
    }

    /**
     * Indicate that the audit log has old and new values.
     */
    public function withValues(array $oldValues = null, array $newValues = null): static
    {
        return $this->state(fn (array $attributes) => [
            'old_values' => $oldValues ?? ['name' => 'Old Name'],
            'new_values' => $newValues ?? ['name' => 'New Name'],
        ]);
    }
}