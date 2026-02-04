<?php

namespace Tests\Feature;

use App\Models\Combo;
use App\Models\Product;
use App\Models\Outlet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComboTest extends TestCase
{
    use RefreshDatabase;
    
    protected $user;
    protected $outlet;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user for authentication
        $this->user = User::factory()->create();
        $this->outlet = Outlet::factory()->create();
        $this->user->outlet_id = $this->outlet->id;
        $this->user->save();
    }

    /**
     * Test creating a combo.
     */
    public function test_create_combo()
    {
        // Create products for the combo
        $product1 = Product::factory()->create(['outlet_id' => $this->outlet->id]);
        $product2 = Product::factory()->create(['outlet_id' => $this->outlet->id]);

        // Login
        $this->actingAs($this->user);

        // Create combo
        $response = $this->postJson('/api/combos', [
            'name' => 'Test Combo',
            'price' => 25000,
            'is_active' => true,
            'outlet_id' => $this->outlet->id,
            'items' => [
                [
                    'product_id' => $product1->id,
                    'qty' => 1
                ],
                [
                    'product_id' => $product2->id,
                    'qty' => 1
                ]
            ]
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'name',
                    'price',
                    'is_active',
                    'outlet_id',
                    'items'
                ]
            ]);

        // Check if combo was created in database
        $this->assertDatabaseHas('combos', [
            'name' => 'Test Combo',
            'price' => 25000,
            'is_active' => true,
            'outlet_id' => $this->outlet->id
        ]);

        // Check if combo items were created
        $combo = Combo::where('name', 'Test Combo')->first();
        $this->assertDatabaseHas('combo_items', [
            'combo_id' => $combo->id,
            'product_id' => $product1->id,
            'qty' => 1
        ]);
        $this->assertDatabaseHas('combo_items', [
            'combo_id' => $combo->id,
            'product_id' => $product2->id,
            'qty' => 1
        ]);
    }

    /**
     * Test getting combos.
     */
    public function test_get_combos()
    {
        // Login
        $this->actingAs($this->user);

        // Get combos
        $response = $this->getJson('/api/combos');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'price',
                        'is_active',
                        'outlet_id',
                        'items'
                    ]
                ]
            ]);
    }

    /**
     * Test checking combo stock.
     */
    public function test_check_combo_stock()
    {
        // Create products for the combo
        $product1 = Product::factory()->create([
            'outlet_id' => $this->outlet->id,
            'stock_quantity' => 10
        ]);
        $product2 = Product::factory()->create([
            'outlet_id' => $this->outlet->id,
            'stock_quantity' => 5
        ]);

        // Create combo
        $combo = Combo::create([
            'name' => 'Test Combo',
            'price' => 25000,
            'is_active' => true,
            'outlet_id' => $this->outlet->id
        ]);

        // Add items to combo
        $combo->items()->create([
            'product_id' => $product1->id,
            'qty' => 1
        ]);
        $combo->items()->create([
            'product_id' => $product2->id,
            'qty' => 1
        ]);

        // Login
        $this->actingAs($this->user);

        // Check stock
        $response = $this->getJson("/api/combos/{$combo->id}/check-stock");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'available',
                'max_qty',
                'insufficient_items'
            ]);

        // Should have enough stock for 5 combos (limited by product2 which has 5 in stock)
        $response->assertJson([
            'available' => true,
            'max_qty' => 5
        ]);
    }

    /**
     * Test getting active combos by outlet.
     */
    public function test_get_active_combos_by_outlet()
    {
        // Create products for the combo
        $product1 = Product::factory()->create(['outlet_id' => $this->outlet->id]);
        $product2 = Product::factory()->create(['outlet_id' => $this->outlet->id]);

        // Create combo
        $combo = Combo::create([
            'name' => 'Test Combo',
            'price' => 25000,
            'is_active' => true,
            'outlet_id' => $this->outlet->id
        ]);

        // Add items to combo
        $combo->items()->create([
            'product_id' => $product1->id,
            'qty' => 1
        ]);
        $combo->items()->create([
            'product_id' => $product2->id,
            'qty' => 1
        ]);

        // Login
        $this->actingAs($this->user);

        // Get active combos by outlet
        $response = $this->getJson("/api/combos/outlet/{$this->outlet->id}/active");

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'price',
                    'is_active',
                    'outlet_id',
                    'items'
                ]
            ]);

        // Should contain our combo
        $response->assertJsonFragment([
            'name' => 'Test Combo',
            'is_active' => true
        ]);
    }
}