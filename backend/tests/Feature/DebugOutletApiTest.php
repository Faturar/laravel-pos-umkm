<?php

use App\Models\User;
use App\Models\Outlet;
use App\Models\Role;
use App\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;

test('debug user permissions', function () {
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
    
    // Refresh user from database
    $user->refresh();
    
    // Check if user has admin role
    $hasAdminRole = $user->hasRole('admin');
    echo "User has admin role: " . ($hasAdminRole ? 'Yes' : 'No') . "\n";
    
    // Check if user has permissions
    foreach ($permissions as $permission) {
        $hasPermission = $user->hasPermission($permission->name);
        echo "User has permission {$permission->name}: " . ($hasPermission ? 'Yes' : 'No') . "\n";
    }
    
    // Get all user permissions
    $allPermissions = $user->getAllPermissions();
    echo "All user permissions: " . implode(', ', $allPermissions) . "\n";
    
    // Get all user roles
    $allRoles = $user->getAllRoles();
    echo "All user roles: " . implode(', ', $allRoles) . "\n";
    
    // Generate JWT token
    $token = JWTAuth::fromUser($user);
    
    // Create an outlet
    $outlet = Outlet::factory()->create();
    
    // Make request to get outlets
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/outlets');

    echo "Response status: " . $response->status() . "\n";
    echo "Response content: " . $response->content() . "\n";
    
    expect(true)->toBeTrue();
});