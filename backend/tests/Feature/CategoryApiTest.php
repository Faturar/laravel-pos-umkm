<?php

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
        \App\Models\Permission::firstOrCreate(['name' => 'view_categories', 'label' => 'View Categories']),
        \App\Models\Permission::firstOrCreate(['name' => 'create_categories', 'label' => 'Create Categories']),
        \App\Models\Permission::firstOrCreate(['name' => 'edit_categories', 'label' => 'Edit Categories']),
        \App\Models\Permission::firstOrCreate(['name' => 'delete_categories', 'label' => 'Delete Categories']),
    ];
    
    // Assign permissions to the role
    $this->role->permissions()->syncWithoutDetaching($this->permissions);
    
    // Assign role to the user
    $this->user->roles()->attach($this->role->id);

    // Create an outlet
    $this->outlet = Outlet::factory()->create();

    // Create JWT token for the user
    $this->token = JWTAuth::fromUser($this->user);
});

test('it can list categories', function () {
    // Create categories
    Category::factory()->count(3)->create(['outlet_id' => $this->outlet->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/categories');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'outlet_id',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('it can create a category', function () {
    $categoryData = [
        'name' => 'Test Category',
        'description' => 'Test Description',
        'outlet_id' => $this->outlet->id,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/categories', $categoryData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'outlet_id',
                'created_at',
                'updated_at',
            ]
        ]);

    $this->assertDatabaseHas('categories', [
        'name' => 'Test Category',
        'description' => 'Test Description',
        'outlet_id' => $this->outlet->id,
    ]);
});

test('it can show a category', function () {
    $category = Category::factory()->create(['outlet_id' => $this->outlet->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/categories/' . $category->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'outlet_id',
                'created_at',
                'updated_at',
            ]
        ]);
});

test('it can update a category', function () {
    $category = Category::factory()->create(['outlet_id' => $this->outlet->id]);

    $updateData = [
        'name' => 'Updated Category',
        'description' => 'Updated Description',
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->putJson('/api/categories/' . $category->id, $updateData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'description',
                'outlet_id',
                'created_at',
                'updated_at',
            ]
        ]);

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Updated Category',
        'description' => 'Updated Description',
    ]);
});

test('it can delete a category', function () {
    $category = Category::factory()->create(['outlet_id' => $this->outlet->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->deleteJson('/api/categories/' . $category->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data'
        ]);

    $this->assertSoftDeleted('categories', [
        'id' => $category->id,
    ]);
});

test('it requires authentication to access categories', function () {
    $response = $this->getJson('/api/categories');

    $response->assertStatus(401);
});