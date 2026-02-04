<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    protected $model = Setting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => $this->faker->unique()->word(),
            'value' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['string', 'number', 'boolean', 'json']),
            'description' => $this->faker->sentence(),
        ];
    }

    

    /**
     * Indicate that the setting is a string type.
     */
    public function stringType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'string',
        ]);
    }

    /**
     * Indicate that the setting is a number type.
     */
    public function numberType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'number',
        ]);
    }

    /**
     * Indicate that the setting is a boolean type.
     */
    public function booleanType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'boolean',
        ]);
    }

    /**
     * Indicate that the setting is a JSON type.
     */
    public function jsonType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'json',
        ]);
    }
}