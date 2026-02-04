<?php

use App\Models\User;
use App\Models\Outlet;
use App\Models\Role;
use App\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;

test('user can view outlets', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
        Permission::factory()->create(['name' => 'switch_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    // Make request to get outlets
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/outlets');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'code',
                    'address',
                    'phone',
                    'email',
                    'is_active',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('user can create outlet', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    $outletData = [
        'name' => 'Test Outlet',
        'code' => 'TEST001',
        'address' => 'Test Address',
        'phone' => '1234567890',
        'email' => 'test@example.com',
        'is_active' => true,
    ];
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/outlets', $outletData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'code',
                'address',
                'phone',
                'email',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);
    
    $this->assertDatabaseHas('outlets', [
        'name' => 'Test Outlet',
        'code' => 'TEST001',
    ]);
});

test('user can view single outlet', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    // Make request to get the outlet
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/outlets/' . $outlet->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'code',
                'address',
                'phone',
                'email',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);
});

test('user can update outlet', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    $updatedData = [
        'name' => 'Updated Outlet',
        'code' => 'UPDATED001',
        'address' => 'Updated Address',
        'phone' => '0987654321',
        'email' => 'updated@example.com',
        'is_active' => false,
    ];
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson('/api/outlets/' . $outlet->id, $updatedData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'name',
                'code',
                'address',
                'phone',
                'email',
                'is_active',
                'created_at',
                'updated_at',
            ]
        ]);
    
    $this->assertDatabaseHas('outlets', [
        'id' => $outlet->id,
        'name' => 'Updated Outlet',
        'code' => 'UPDATED001',
    ]);
});

test('user can delete outlet', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->deleteJson('/api/outlets/' . $outlet->id);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
        ]);

    // Check that the outlet was soft deleted
    $this->assertSoftDeleted('outlets', [
        'id' => $outlet->id,
    ]);
});

test('user can switch outlet', function () {
    // Create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);

    // Create a role
    $role = Role::factory()->create(['name' => 'admin']);
    
    // Create permissions
    $permissions = [
        Permission::factory()->create(['name' => 'view_outlets']),
        Permission::factory()->create(['name' => 'create_outlets']),
        Permission::factory()->create(['name' => 'edit_outlets']),
        Permission::factory()->create(['name' => 'delete_outlets']),
        Permission::factory()->create(['name' => 'switch_outlets']),
    ];
    
    // Attach permissions to role
    $role->permissions()->syncWithoutDetaching($permissions);
    
    // Attach role to user
    $user->roles()->attach($role->id);
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create another outlet
    $outlet = Outlet::factory()->create();
    
    $switchData = [
        'outlet_id' => $outlet->id,
    ];
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/outlets/switch', $switchData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'outlet',
                'user',
            ]
        ]);
    
    // Check that the user's current outlet was updated
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'current_outlet_id' => $outlet->id,
    ]);
});

test('unauthenticated user cannot access outlets', function () {
    $response = $this->getJson('/api/outlets');
    $response->assertStatus(401);
});

test('user without permissions cannot access outlets', function () {
    // Create a user without permissions
    $user = User::factory()->create([
        'email' => 'nopermission@example.com',
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);
    
    $token = JWTAuth::fromUser($user);
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/outlets');
    
    $response->assertStatus(403);
});