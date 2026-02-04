<?php

use App\Models\User;
use App\Models\Setting;
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
        \App\Models\Permission::firstOrCreate(['name' => 'view_settings', 'label' => 'View Settings']),
        \App\Models\Permission::firstOrCreate(['name' => 'manage_settings', 'label' => 'Manage Settings']),
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

test('it can get settings', function () {
    // Create some settings
    Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);
    
    Setting::factory()->create([
        'key' => 'service_charge_percentage',
        'value' => '5',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/settings');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'key',
                    'value',
                    'type',
                    'description',
                    'outlet_id',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);
});

test('it can get settings by group', function () {
    // Create some settings with different groups
    Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'group' => 'tax',
        'outlet_id' => $this->outlet->id,
    ]);
    
    Setting::factory()->create([
        'key' => 'service_charge_percentage',
        'value' => '5',
        'type' => 'number',
        'group' => 'payment',
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/settings?group=tax');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'key',
                    'value',
                    'type',
                    'description',
                    'outlet_id',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);

    // Check that all returned settings have the group 'tax'
    foreach ($response->json('data') as $setting) {
        $this->assertEquals('tax', $setting['group']);
    }
});

test('it can update a setting', function () {
    $setting = Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);

    $updateData = [
        'value' => '12',
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->putJson('/api/settings/' . $setting->id, $updateData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'key',
                'value',
                'type',
                'description',
                'outlet_id',
                'created_at',
                'updated_at',
            ]
        ]);

    // Check that the setting was updated in the database
    $this->assertDatabaseHas('settings', [
        'id' => $setting->id,
        'value' => '12',
    ]);
});

test('it can update multiple settings', function () {
    $setting1 = Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);
    
    $setting2 = Setting::factory()->create([
        'key' => 'service_charge_percentage',
        'value' => '5',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);

    $updateData = [
        'settings' => [
            [
                'id' => $setting1->id,
                'value' => '12',
            ],
            [
                'id' => $setting2->id,
                'value' => '7',
            ],
        ],
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/settings/bulk-update', $updateData);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'key',
                    'value',
                    'type',
                    'description',
                    'outlet_id',
                    'created_at',
                    'updated_at',
                ]
            ]
        ]);

    // Check that the settings were updated in the database
    $this->assertDatabaseHas('settings', [
        'id' => $setting1->id,
        'value' => '12',
    ]);
    
    $this->assertDatabaseHas('settings', [
        'id' => $setting2->id,
        'value' => '7',
    ]);
});

test('it can reset a setting to default', function () {
    $setting = Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/settings/' . $setting->id . '/reset');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'key',
                'value',
                'type',
                'description',
                'outlet_id',
                'created_at',
                'updated_at',
            ]
        ]);

    // Check that the setting was reset to the default value
    $this->assertDatabaseHas('settings', [
        'id' => $setting->id,
        'value' => '11',
    ]);
});

test('it can get POS settings', function () {
    // Create some POS-related settings
    Setting::factory()->create([
        'key' => 'receipt_header',
        'value' => 'Test Store',
        'type' => 'text',
        'group' => 'receipt',
        'outlet_id' => $this->outlet->id,
    ]);
    
    Setting::factory()->create([
        'key' => 'receipt_footer',
        'value' => 'Thank you for shopping',
        'type' => 'text',
        'group' => 'receipt',
        'outlet_id' => $this->outlet->id,
    ]);

    // Check if the user has the required permission
    $userPermissions = $this->user->roles->flatMap->permissions->pluck('name')->toArray();
    echo "User permissions: " . implode(', ', $userPermissions) . "\n";
    
    // Check if the user has the view_settings permission
    $hasPermission = in_array('view_settings', $userPermissions);
    echo "User has view_settings permission: " . ($hasPermission ? 'Yes' : 'No') . "\n";
    
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/settings/pos');
    
    echo "Response status: " . $response->status() . "\n";
    echo "Response content: " . $response->content() . "\n";

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'receipt',
                'payment',
                'tax',
                'general',
            ]
        ]);
});

test('it requires authentication to access settings', function () {
    $response = $this->getJson('/api/settings');

    $response->assertStatus(401);
});

test('it validates setting update data', function () {
    $setting = Setting::factory()->create([
        'key' => 'tax_percentage',
        'value' => '10',
        'type' => 'number',
        'outlet_id' => $this->outlet->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->putJson('/api/settings/' . $setting->id, []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['value']);
});