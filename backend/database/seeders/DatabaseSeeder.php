<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        // Create or update default admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'status' => 'active',
            ]
        );

        // Assign admin role to admin user
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->sync([$adminRole->id]); // Use sync to avoid duplicates
        }

        // Create test users for each role
        $roles = \App\Models\Role::all();
        
        foreach ($roles as $role) {
            if ($role->name !== 'admin') {
                $user = User::updateOrCreate(
                    ['email' => $role->name . '@example.com'],
                    [
                        'name' => ucfirst($role->name) . ' User',
                        'status' => 'active',
                    ]
                );
                
                $user->roles()->sync([$role->id]); // Use sync to avoid duplicates
            }
        }
    }
}