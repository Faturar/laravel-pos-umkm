<?php

use App\Models\Transaction;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Outlet;
use App\Models\Customer;
use Tymon\JWTAuth\Facades\JWTAuth;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = \App\Models\Role::factory()->create(['name' => 'cashier']);
    
    // Create permissions
    $permissions = [
        \App\Models\Permission::firstOrCreate(['name' => 'view_transactions', 'label' => 'View Transactions']),
        \App\Models\Permission::firstOrCreate(['name' => 'create_transactions', 'label' => 'Create Transactions']),
        \App\Models\Permission::firstOrCreate(['name' => 'edit_transactions', 'label' => 'Edit Transactions']),
        \App\Models\Permission::firstOrCreate(['name' => 'void_transactions', 'label' => 'Void Transactions']),
        \App\Models\Permission::firstOrCreate(['name' => 'refund_transactions', 'label' => 'Refund Transactions']),
    ];
    
    // Assign permissions to the role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Assign role to the user
    $user->roles()->attach($role->id);

    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    // Create a category
    $category = Category::factory()->create(['outlet_id' => $outlet->id]);
    
    // Create a product
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'outlet_id' => $outlet->id,
        'stock_quantity' => 100, // Ensure enough stock for tests
    ]);
    
    // Create a customer
    $customer = Customer::factory()->create();

    // Create JWT token for the user
    $token = JWTAuth::fromUser($user);
    
    // Store variables for use in tests
    test()->user = $user;
    test()->role = $role;
    test()->permissions = $permissions;
    test()->outlet = $outlet;
    test()->category = $category;
    test()->product = $product;
    test()->customer = $customer;
    test()->token = $token;
});

test('debug daily summary endpoint', function () {
    // Create some transactions
    Transaction::factory()->count(3)->create([
        'outlet_id' => test()->outlet->id,
        'customer_id' => test()->customer->id,
        'status' => 'completed',
        'created_at' => now(),
    ]);

    // First try without authentication to see if the route exists
    $response = test()->getJson('/api/transactions/daily-summary');
    echo "Without auth: " . $response->status() . "\n";
    
    // If we get a 401 or 403, the route exists but we need authentication
    if ($response->status() === 401 || $response->status() === 403) {
        $response = test()->withHeaders([
            'Authorization' => 'Bearer ' . test()->token,
        ])->getJson('/api/transactions/daily-summary');
        
        echo "With auth: " . $response->status() . "\n";
        echo "Response content: " . $response->content() . "\n";
    }
    
    // Check if the user has the required permission
    $permissions = test()->user->getAllPermissions();
    if (is_array($permissions)) {
        echo "User permissions: " . implode(', ', array_column($permissions, 'name')) . "\n";
    } else {
        echo "User permissions: " . implode(', ', $permissions->pluck('name')->toArray()) . "\n";
    }
    echo "User has view_transactions permission: " . (test()->user->hasPermissionTo('view_transactions') ? 'Yes' : 'No') . "\n";
    
    // Check if the user has an outlet_id
    echo "User outlet_id: " . (test()->user->outlet_id ?? 'null') . "\n";
    echo "Outlet ID: " . test()->outlet->id . "\n";
    
    // Try to get the daily summary with a specific outlet_id
    $response = test()->withHeaders([
        'Authorization' => 'Bearer ' . test()->token,
    ])->getJson('/api/transactions/daily-summary?outlet_id=' . test()->outlet->id);
    
    echo "With outlet_id: " . $response->status() . "\n";
    echo "Response content: " . $response->content() . "\n";
    
    // Expect a 200 status code
    $response->assertStatus(200);
})->skip('This is a debug test and should be skipped in normal test runs');