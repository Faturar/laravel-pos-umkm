<?php

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Outlet;
use Tymon\JWTAuth\Facades\JWTAuth;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Create a user
    $this->user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $this->role = \App\Models\Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $this->permissions = [
        \App\Models\Permission::firstOrCreate(['name' => 'view_stock', 'label' => 'View Stock']),
        \App\Models\Permission::firstOrCreate(['name' => 'manage_stock', 'label' => 'Manage Stock']),
    ];
    
    // Assign permissions to the role
    $this->role->permissions()->syncWithoutDetaching($this->permissions);
    
    // Assign role to the user
    $this->user->roles()->attach($this->role->id);

    // Create an outlet
    $this->outlet = Outlet::factory()->create();
    
    // Create a category
    $this->category = Category::factory()->create(['outlet_id' => $this->outlet->id]);
    
    // Create a product
    $this->product = Product::factory()->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
        'stock_quantity' => 100,
    ]);

    // Create JWT token for the user
    $this->token = JWTAuth::fromUser($this->user);
});

test('it can list stock', function () {
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/stocks');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'product_id',
                    'product_name',
                    'current_stock',
                    'outlet_id',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('it can get stock movements', function () {
    // Create some stock movements
    StockMovement::factory()->count(3)->create([
        'product_id' => $this->product->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/stocks/movements');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'product_id',
                    'product_name',
                    'quantity',
                    'before_quantity',
                    'after_quantity',
                    'movement_type',
                    'reference',
                    'notes',
                    'created_at',
                ]
            ]
        ]);
});

test('it can get stock summary', function () {
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/stocks/summary');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'total_products',
                'low_stock_products',
                'out_of_stock_products',
                'total_stock_value',
                'by_category',
            ]
        ]);
});

test('it can add stock (stock in)', function () {
    $stockInData = [
        'product_id' => $this->product->id,
        'quantity' => 50,
        'cost' => 10000,
        'notes' => 'Initial stock',
        'reference' => 'PO-001',
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/stocks/in', $stockInData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'product_id',
                'quantity',
                'before_quantity',
                'after_quantity',
                'movement_type',
                'reference',
                'notes',
                'created_at',
            ]
        ]);

    // Check that the product stock has been updated
    $this->assertDatabaseHas('products', [
        'id' => $this->product->id,
        'stock_quantity' => 150, // 100 + 50
    ]);

    // Check that a stock movement record was created
    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $this->product->id,
        'quantity' => 50,
        'before_quantity' => 100,
        'after_quantity' => 150,
        'type' => 'in',
    ]);
});

test('it can adjust stock', function () {
    $adjustmentData = [
        'product_id' => $this->product->id,
        'new_stock' => 90, // Set stock to 90 (reduce by 10)
        'reason' => 'Damaged items',
        'reference' => 'ADJ-001',
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/stocks/adjust', $adjustmentData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'product_id',
                'quantity',
                'before_quantity',
                'after_quantity',
                'movement_type',
                'reference',
                'notes',
                'created_at',
            ]
        ]);

    // Check that the product stock has been updated
    $this->assertDatabaseHas('products', [
        'id' => $this->product->id,
        'stock_quantity' => 90, // 100 - 10
    ]);

    // Check that a stock movement record was created
    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $this->product->id,
        'quantity' => 10,
        'before_quantity' => 100,
        'after_quantity' => 90,
        'type' => 'out',
    ]);
});

test('it requires authentication to access stock endpoints', function () {
    $response = $this->getJson('/api/stocks');

    $response->assertStatus(401);
});