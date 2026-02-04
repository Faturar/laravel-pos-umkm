<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DebugSettingsApiTest extends TestCase
{
    protected $token;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user with the necessary permissions
        $this->user = User::factory()->create();
        $role = Role::factory()->create(['name' => 'admin']);
        $permission = Permission::factory()->create(['name' => 'view_settings']);
        
        // Assign role and permission to user
        $this->user->roles()->attach($role->id);
        $role->permissions()->attach($permission->id);
        
        // Generate JWT token for the user
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    /** @test */
    public function it_debugs_pos_settings_endpoint()
    {
        // Log the user's permissions
        $userPermissions = $this->user->roles->flatMap->permissions->pluck('name')->toArray();
        echo "User permissions: " . implode(', ', $userPermissions) . "\n";
        
        // Check if the user has the required permission
        $hasPermission = $this->user->hasPermission('view_settings');
        echo "User has view_settings permission: " . ($hasPermission ? 'Yes' : 'No') . "\n";
        
        // Try to access the POS settings endpoint
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/settings/pos');
        
        echo "Response status: " . $response->status() . "\n";
        echo "Response content: " . $response->content() . "\n";
        
        // Check if the route exists
        $routeExists = \Route::has('api.settings.pos');
        echo "Route exists: " . ($routeExists ? 'Yes' : 'No') . "\n";
        
        // Try to access a different settings endpoint
        $response2 = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/settings');
        
        echo "Other endpoint status: " . $response2->status() . "\n";
        
        // Just return true to pass the test
        $this->assertTrue(true);
    }
}