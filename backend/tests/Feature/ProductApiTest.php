<?php

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
        \App\Models\Permission::firstOrCreate(['name' => 'view_products', 'label' => 'View Products']),
        \App\Models\Permission::firstOrCreate(['name' => 'create_products', 'label' => 'Create Products']),
        \App\Models\Permission::firstOrCreate(['name' => 'edit_products', 'label' => 'Edit Products']),
        \App\Models\Permission::firstOrCreate(['name' => 'delete_products', 'label' => 'Delete Products']),
    ];
    
    // Assign permissions to the role
    $this->role->permissions()->syncWithoutDetaching($this->permissions);
    
    // Assign role to the user
    $this->user->roles()->attach($this->role->id);

    // Create an outlet
    $this->outlet = Outlet::factory()->create();
    
    // Create a category
    $this->category = Category::factory()->create(['outlet_id' => $this->outlet->id]);

    // Create JWT token for the user
    $this->token = JWTAuth::fromUser($this->user);
});

test('it can list products', function () {
    // Create products
    Product::factory()->count(3)->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/products');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'cost',
                    'sku',
                    'barcode',
                    'category_id',
                    'outlet_id',
                    'is_active',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('it can create a product', function () {
    $productData = [
        'name' => 'Test Product',
        'description' => 'Test Description',
        'price' => 10000,
        'cost' => 8000,
        'sku' => 'TEST-001',
        'barcode' => '123456789',
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/products', $productData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'price',
                'cost',
                'sku',
                'barcode',
                'category_id',
                'outlet_id',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'description' => 'Test Description',
        'price' => 10000,
        'cost' => 8000,
        'sku' => 'TEST-001',
        'barcode' => '123456789',
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);
});

test('it can show a product', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/products/' . $product->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'price',
                'cost',
                'sku',
                'barcode',
                'category_id',
                'outlet_id',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);
});

test('it can update a product', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $updateData = [
        'name' => 'Updated Product',
        'description' => 'Updated Description',
        'price' => 12000,
        'cost' => 9000,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->putJson('/api/products/' . $product->id, $updateData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'price',
                'cost',
                'sku',
                'barcode',
                'category_id',
                'outlet_id',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product',
        'description' => 'Updated Description',
        'price' => 12000,
        'cost' => 9000,
    ]);
});

test('it can delete a product', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->deleteJson('/api/products/' . $product->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message'
        ]);

    $this->assertSoftDeleted('products', [
        'id' => $product->id,
    ]);
});

test('it can search products', function () {
    // Create products
    Product::factory()->create([
        'name' => 'Test Product One',
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);
    
    Product::factory()->create([
        'name' => 'Test Product Two',
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/products/search?query=Test');

    // Dump response if status is not 200
    if ($response->status() != 200) {
        dump($response->status());
        dump($response->json());
    }

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'cost',
                    'sku',
                    'barcode',
                    'category_id',
                    'outlet_id',
                    'is_active',
                    'created_at',
                    'updated_at',
                ]
            ]
        ])
        ->assertJsonCount(2, 'data');
});

test('it requires authentication to access products', function () {
    $response = $this->getJson('/api/products');

    $response->assertStatus(401);
});