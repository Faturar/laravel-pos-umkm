<?php

use App\Models\User;
use App\Models\AuditLog;
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
        \App\Models\Permission::firstOrCreate(['name' => 'view_audit_logs', 'label' => 'View Audit Logs']),
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

test('it can list audit logs', function () {
    // Create some audit logs
    AuditLog::factory()->count(5)->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/audit-logs');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'user_name',
                    'action',
                    'model_type',
                    'model_id',
                    'old_values',
                    'new_values',
                    'ip_address',
                    'user_agent',
                    'created_at',
                ]
            ]
        ]);
});

test('it can filter audit logs by action', function () {
    // Create audit logs with different actions
    AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'action' => 'create',
    ]);
    
    AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'action' => 'update',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/audit-logs?action=create');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'user_name',
                    'action',
                    'model_type',
                    'model_id',
                    'old_values',
                    'new_values',
                    'ip_address',
                    'user_agent',
                    'created_at',
                ]
            ]
        ]);

    // Check that all returned logs have the action 'create'
    foreach ($response->json('data') as $log) {
        $this->assertEquals('create', $log['action']);
    }
});

test('it can filter audit logs by user', function () {
    // Create another user
    $otherUser = User::factory()->create();
    
    // Create audit logs for both users
    AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
    ]);
    
    AuditLog::factory()->create([
        'user_id' => $otherUser->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/audit-logs?user_id=' . $this->user->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'user_name',
                    'action',
                    'model_type',
                    'model_id',
                    'old_values',
                    'new_values',
                    'ip_address',
                    'user_agent',
                    'created_at',
                ]
            ]
        ]);

    // Check that all returned logs have the correct user_id
    foreach ($response->json('data') as $log) {
        $this->assertEquals($this->user->id, $log['user_id']);
    }
});

test('it can filter audit logs by model type', function () {
    // Create audit logs for different model types
    AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'model_type' => 'Product',
    ]);
    
    AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'model_type' => 'Category',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/audit-logs?model_type=Product');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'user_name',
                    'action',
                    'model_type',
                    'model_id',
                    'old_values',
                    'new_values',
                    'ip_address',
                    'user_agent',
                    'created_at',
                ]
            ]
        ]);

    // Check that all returned logs have the model_type 'Product'
    foreach ($response->json('data') as $log) {
        $this->assertEquals('Product', $log['model_type']);
    }
});

test('it can filter audit logs by date range', function () {
    // Create audit logs with different dates
    $oldLog = AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'created_at' => now()->subDays(10),
    ]);
    
    $newLog = AuditLog::factory()->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
        'created_at' => now(),
    ]);

    $fromDate = now()->subDays(7)->format('Y-m-d');
    $toDate = now()->addDay()->format('Y-m-d');

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson("/api/audit-logs?from={$fromDate}&to={$toDate}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'user_name',
                    'action',
                    'model_type',
                    'model_id',
                    'old_values',
                    'new_values',
                    'ip_address',
                    'user_agent',
                    'created_at',
                ]
            ]
        ]);

    // Check that only the new log is returned
    $this->assertCount(1, $response->json('data'));
    $this->assertEquals($newLog->id, $response->json('data')[0]['id']);
});

test('it can paginate audit logs', function () {
    // Create more audit logs than the default page size
    AuditLog::factory()->count(20)->create([
        'user_id' => $this->user->id,
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/audit-logs?per_page=5');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data',
            'meta' => [
                'current_page',
                'from',
                'last_page',
                'path',
                'per_page',
                'to',
                'total',
            ]
        ]);

    // Check that only 5 logs are returned
    $this->assertCount(5, $response->json('data'));
});

test('it requires authentication to access audit logs', function () {
    $response = $this->getJson('/api/audit-logs');

    $response->assertStatus(401);
});