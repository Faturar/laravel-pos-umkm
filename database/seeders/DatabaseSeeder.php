<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed permissions first (required by roles)
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        // Create default admin user
        $admin = User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'status' => 'active',
        ]);

        // Assign admin role to admin user
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->attach($adminRole->id);
        }

        // Create test users for each role
        $roles = \App\Models\Role::all();
        
        foreach ($roles as $role) {
            if ($role->name !== 'admin') {
                $user = User::factory()->create([
                    'name' => ucfirst($role->name) . ' User',
                    'email' => $role->name . '@example.com',
                    'status' => 'active',
                ]);
                
                $user->roles()->attach($role->id);
            }
        }
    }
}