<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear cache
        app()->make(\Illuminate\Contracts\Cache\Repository::class)->forget('spatie.permission.cache');
        
        // Truncate tables
        DB::table('roles')->delete();
        DB::table('permission_role')->delete();

        // Define roles with their permissions
        $roles = [
            // Admin Role - Full access
            [
                'name' => 'admin',
                'label' => 'Administrator',
                'description' => 'Full system access',
                'permissions' => [
                    'view_users', 'create_users', 'update_users', 'delete_users', 'manage_users', 'assign_roles',
                    'view_roles', 'create_roles', 'update_roles', 'delete_roles', 'manage_roles', 'assign_permissions', 'view_permissions',
                    'view_orders', 'create_order', 'update_order', 'delete_order', 'refund_order', 'manage_order',
                    'view_reports', 'export_reports', 'view_sales_report', 'view_inventory_report', 'view_customer_report',
                    'view_employees', 'create_employees', 'update_employees', 'delete_employees', 'manage_employees',
                    'view_payroll', 'create_payroll', 'update_payroll', 'approve_payroll', 'manage_payroll',
                    'view_attendance', 'create_attendance', 'update_attendance', 'manage_attendance',
                    'view_settings', 'update_settings', 'view_audit_logs', 'manage_system',
                    'view_products', 'create_products', 'edit_products', 'delete_products',
                    'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
                    'view_stock', 'manage_stock',
                    'view_outlets', 'create_outlets', 'edit_outlets', 'delete_outlets', 'switch_outlets',
                    'view_transactions', 'create_transactions', 'edit_transactions', 'void_transactions', 'refund_transactions',
                    'sync_data'
                ]
            ],
            
            // Manager Role - Limited admin access
            [
                'name' => 'manager',
                'label' => 'Manager',
                'description' => 'Manager with limited admin access',
                'permissions' => [
                    'view_users', 'update_users', 'manage_users',
                    'view_roles', 'view_permissions',
                    'view_orders', 'create_order', 'update_order', 'manage_order',
                    'view_reports', 'export_reports', 'view_sales_report', 'view_inventory_report',
                    'view_employees', 'update_employees', 'manage_employees',
                    'view_payroll', 'update_payroll', 'approve_payroll',
                    'view_attendance', 'update_attendance', 'manage_attendance',
                    'view_settings',
                    'view_products', 'edit_products',
                    'view_categories', 'edit_categories',
                    'view_stock', 'manage_stock',
                    'view_outlets', 'edit_outlets', 'switch_outlets',
                    'view_transactions', 'create_transactions', 'edit_transactions',
                    'sync_data'
                ]
            ],
            
            // Kasir/Cashier Role - POS access
            [
                'name' => 'kasir',
                'label' => 'Kasir',
                'description' => 'Cashier/POS access',
                'permissions' => [
                    'view_orders', 'create_order', 'update_order',
                    'view_reports', 'view_sales_report',
                    'view_products',
                    'view_categories',
                    'view_stock',
                    'view_transactions', 'create_transactions'
                ]
            ],
            
            // HRD Role - HR access
            [
                'name' => 'hrd',
                'label' => 'HRD',
                'description' => 'Human Resources Department access',
                'permissions' => [
                    'view_employees', 'create_employees', 'update_employees', 'manage_employees',
                    'view_payroll', 'create_payroll', 'update_payroll', 'manage_payroll',
                    'view_attendance', 'create_attendance', 'update_attendance', 'manage_attendance',
                    'view_reports', 'view_employee_report'
                ]
            ],
            
            // Staff Role - Limited access
            [
                'name' => 'staff',
                'label' => 'Staff',
                'description' => 'Limited staff access',
                'permissions' => [
                    'view_attendance'
                ]
            ],
            
            // Finance Role - Financial access
            [
                'name' => 'finance',
                'label' => 'Finance',
                'description' => 'Financial department access',
                'permissions' => [
                    'view_payroll', 'create_payroll', 'update_payroll', 'approve_payroll', 'manage_payroll',
                    'view_reports', 'export_reports', 'view_sales_report', 'view_payroll_report'
                ]
            ],
            
            // Report Viewer Role - Read-only access
            [
                'name' => 'report_viewer',
                'label' => 'Report Viewer',
                'description' => 'Read-only access to reports',
                'permissions' => [
                    'view_reports', 'view_sales_report', 'view_inventory_report', 'view_customer_report', 'view_employee_report'
                ]
            ],
        ];

        // Create roles and assign permissions
        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);
            
            $role = Role::create($roleData);
            
            // Get permission IDs
            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
            
            // Attach permissions to role
            if ($permissionIds->isNotEmpty()) {
                $role->permissions()->attach($permissionIds);
            }
        }

        $this->command->info('Roles seeded successfully!');
    }
}