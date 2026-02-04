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
    $this->user = $user;
    $this->role = $role;
    $this->permissions = $permissions;
    $this->outlet = $outlet;
    $this->category = $category;
    $this->product = $product;
    $this->customer = $customer;
    $this->token = $token;
});

test('it can create a transaction', function () {
    $transactionData = [
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
        'items' => [
            [
                'product_id' => $this->product->id,
                'qty' => 2,
                'price' => $this->product->price,
            ]
        ],
        'discount_amount' => 0,
        'tax_amount' => 10,
        'payment_method' => 'cash',
        'paid_amount' => $this->product->price * 2 * 1.1,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/transactions', $transactionData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'invoice_number',
                'customer_id',
                'subtotal',
                'discount_amount',
                'tax_amount',
                'final_amount',
                'paid_amount',
                'change_amount',
                'payment_method',
                'status',
                'created_at',
                'updated_at',
            ]
        ]);

    $this->assertDatabaseHas('transactions', [
        'customer_id' => $this->customer->id,
        'subtotal' => $this->product->price * 2,
        'discount_amount' => 0,
        'tax_amount' => 0,
        'payment_method' => 'cash',
    ]);
});

test('it can list transactions', function () {
    // Create a transaction
    $transaction = Transaction::factory()->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/transactions');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'invoice_number',
                    'customer_id',
                    'subtotal',
                    'discount_amount',
                    'tax_amount',
                    'final_amount',
                    'paid_amount',
                    'change_amount',
                    'payment_method',
                    'status',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('it can show a transaction', function () {
    $transaction = Transaction::factory()->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/transactions/' . $transaction->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'invoice_number',
                'customer_id',
                'subtotal',
                'discount_amount',
                'tax_amount',
                'final_amount',
                'paid_amount',
                'change_amount',
                'payment_method',
                'status',
                'created_at',
                'updated_at',
            ]
        ]);
});

test('it can void a transaction', function () {
    $transaction = Transaction::factory()->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
        'status' => 'completed',
    ]);

    $voidData = [
        'reason' => 'Customer request',
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/transactions/' . $transaction->id . '/void', $voidData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data'
        ]);

    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'status' => 'voided',
        'is_void' => 1,
        'void_reason' => 'Customer request',
    ]);
});

test('it can refund a transaction', function () {
    // Create a transaction with items
    $transaction = Transaction::factory()->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
        'status' => 'completed',
    ]);

    // Create a transaction item
    $item = \App\Models\TransactionItem::factory()->create([
        'transaction_id' => $transaction->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => $this->product->price,
        'total_price' => $this->product->price,
    ]);

    $refundData = [
        'refund_amount' => $transaction->final_amount / 2,
        'refund_reason' => 'Product return',
        'items_to_refund' => [$item->id],
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/transactions/' . $transaction->id . '/refund', $refundData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data'
        ]);

    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'status' => 'refunded',
        'is_refund' => 1,
    ]);
});

test('it can get daily summary', function () {
    // Create some transactions
    Transaction::factory()->count(3)->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
        'status' => 'completed',
        'created_at' => now(),
    ]);

    // First try without authentication to see if the route exists
    $response = $this->getJson('/api/transactions/daily-summary');
    
    // If we get a 401 or 403, the route exists but we need authentication
    if ($response->status() === 401 || $response->status() === 403) {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/transactions/daily-summary');
    }

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'total_transactions',
                'total_revenue',
                'total_items_sold',
                'average_transaction_value',
                'payment_methods',
            ]
        ]);
});

test('it can get transaction statistics', function () {
    // Create some transactions
    Transaction::factory()->count(3)->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
        'status' => 'completed',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/transactions/statistics');

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

test('it can generate a receipt', function () {
    $transaction = Transaction::factory()->create([
        'outlet_id' => $this->outlet->id,
        'customer_id' => $this->customer->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/receipts/' . $transaction->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'transaction',
                'items',
                'outlet',
                'payment_info',
            ]
        ]);
});

test('it requires authentication to access transactions', function () {
    $response = $this->getJson('/api/transactions');

    $response->assertStatus(401);
});