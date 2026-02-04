<?php

use App\Models\Transaction;
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
        \App\Models\Permission::firstOrCreate(['name' => 'view_reports', 'label' => 'View Reports']),
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
    ]);

    // Create JWT token for the user
    $this->token = JWTAuth::fromUser($this->user);
});

test('it can get report summary', function () {
    // Create some transactions
    Transaction::factory()->count(5)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/summary');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'today',
                'this_week',
                'this_month',
                'this_year',
            ]
        ]);
});

test('it can get sales report', function () {
    // Create some transactions
    Transaction::factory()->count(5)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
        'created_at' => now(),
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/sales');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'sales',
                'total_revenue',
                'total_transactions',
                'average_transaction_value',
                'best_hour',
                'best_day',
            ]
        ]);
});

test('it can get sales report with date range', function () {
    // Create some transactions
    Transaction::factory()->count(5)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
        'created_at' => now()->subDays(5),
    ]);

    $fromDate = now()->subDays(7)->format('Y-m-d');
    $toDate = now()->format('Y-m-d');

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson("/api/reports/sales?from={$fromDate}&to={$toDate}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'sales',
                'total_revenue',
                'total_transactions',
                'average_transaction_value',
                'best_hour',
                'best_day',
            ]
        ]);
});

test('it can get products report', function () {
    // Create some products
    Product::factory()->count(5)->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/products');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'products',
                'total_products',
                'total_value',
                'top_products',
                'low_stock_products',
            ]
        ]);
});

test('it can get payments report', function () {
    // Create some transactions with different payment methods
    Transaction::factory()->count(3)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
        'payment_method' => 'cash',
    ]);
    
    Transaction::factory()->count(2)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
        'payment_method' => 'card',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/payments');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'payment_methods',
                'total_amount',
                'transactions_count',
            ]
        ]);
});

test('it can get cash report', function () {
    // Create some transactions
    Transaction::factory()->count(5)->create([
        'outlet_id' => $this->outlet->id,
        'status' => 'completed',
        'payment_method' => 'cash',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/cash');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'cash_in',
                'cash_out',
                'net_cash',
                'opening_balance',
                'closing_balance',
            ]
        ]);
});

test('it can get inventory report', function () {
    // Create some products
    Product::factory()->count(5)->create([
        'category_id' => $this->category->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/reports/inventory');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'inventory',
                'total_products',
                'total_stock_value',
                'low_stock_products',
                'out_of_stock_products',
                'by_category',
            ]
        ]);
});

test('it requires authentication to access reports', function () {
    $response = $this->getJson('/api/reports/summary');

    $response->assertStatus(401);
});