<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
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
        
        // Truncate permissions table
        DB::table('permissions')->delete();

        // Define permissions with groups
        $permissions = [
            // User Management
            ['name' => 'view_users', 'label' => 'View Users', 'group' => 'user'],
            ['name' => 'create_users', 'label' => 'Create Users', 'group' => 'user'],
            ['name' => 'update_users', 'label' => 'Update Users', 'group' => 'user'],
            ['name' => 'delete_users', 'label' => 'Delete Users', 'group' => 'user'],
            ['name' => 'manage_users', 'label' => 'Manage Users', 'group' => 'user'],
            ['name' => 'assign_roles', 'label' => 'Assign Roles', 'group' => 'user'],
            
            // Role Management
            ['name' => 'view_roles', 'label' => 'View Roles', 'group' => 'role'],
            ['name' => 'create_roles', 'label' => 'Create Roles', 'group' => 'role'],
            ['name' => 'update_roles', 'label' => 'Update Roles', 'group' => 'role'],
            ['name' => 'delete_roles', 'label' => 'Delete Roles', 'group' => 'role'],
            ['name' => 'manage_roles', 'label' => 'Manage Roles', 'group' => 'role'],
            ['name' => 'assign_permissions', 'label' => 'Assign Permissions', 'group' => 'role'],
            ['name' => 'view_permissions', 'label' => 'View Permissions', 'group' => 'role'],
            
            // Order Management (for POS example)
            ['name' => 'view_orders', 'label' => 'View Orders', 'group' => 'order'],
            ['name' => 'create_order', 'label' => 'Create Order', 'group' => 'order'],
            ['name' => 'update_order', 'label' => 'Update Order', 'group' => 'order'],
            ['name' => 'delete_order', 'label' => 'Delete Order', 'group' => 'order'],
            ['name' => 'refund_order', 'label' => 'Refund Order', 'group' => 'order'],
            ['name' => 'manage_order', 'label' => 'Manage Order', 'group' => 'order'],
            
            // Report Management
            ['name' => 'view_reports', 'label' => 'View Reports', 'group' => 'report'],
            ['name' => 'export_reports', 'label' => 'Export Reports', 'group' => 'report'],
            ['name' => 'view_sales_report', 'label' => 'View Sales Report', 'group' => 'report'],
            ['name' => 'view_inventory_report', 'label' => 'View Inventory Report', 'group' => 'report'],
            ['name' => 'view_customer_report', 'label' => 'View Customer Report', 'group' => 'report'],
            
            // Employee Management (for HRIS example)
            ['name' => 'view_employees', 'label' => 'View Employees', 'group' => 'employee'],
            ['name' => 'create_employees', 'label' => 'Create Employees', 'group' => 'employee'],
            ['name' => 'update_employees', 'label' => 'Update Employees', 'group' => 'employee'],
            ['name' => 'delete_employees', 'label' => 'Delete Employees', 'group' => 'employee'],
            ['name' => 'manage_employees', 'label' => 'Manage Employees', 'group' => 'employee'],
            
            // Payroll Management
            ['name' => 'view_payroll', 'label' => 'View Payroll', 'group' => 'payroll'],
            ['name' => 'create_payroll', 'label' => 'Create Payroll', 'group' => 'payroll'],
            ['name' => 'update_payroll', 'label' => 'Update Payroll', 'group' => 'payroll'],
            ['name' => 'approve_payroll', 'label' => 'Approve Payroll', 'group' => 'payroll'],
            ['name' => 'manage_payroll', 'label' => 'Manage Payroll', 'group' => 'payroll'],
            
            // Attendance Management
            ['name' => 'view_attendance', 'label' => 'View Attendance', 'group' => 'attendance'],
            ['name' => 'create_attendance', 'label' => 'Create Attendance', 'group' => 'attendance'],
            ['name' => 'update_attendance', 'label' => 'Update Attendance', 'group' => 'attendance'],
            ['name' => 'manage_attendance', 'label' => 'Manage Attendance', 'group' => 'attendance'],
            
            // System Management
            ['name' => 'view_settings', 'label' => 'View Settings', 'group' => 'system'],
            ['name' => 'update_settings', 'label' => 'Update Settings', 'group' => 'system'],
            ['name' => 'view_audit_logs', 'label' => 'View Audit Logs', 'group' => 'system'],
            ['name' => 'manage_system', 'label' => 'Manage System', 'group' => 'system'],
        ];

        // Insert permissions
        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        $this->command->info('Permissions seeded successfully!');
    }
}