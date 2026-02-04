<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuditLogPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any audit logs.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_audit_logs');
    }

    /**
     * Determine whether the user can view the audit log.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AuditLog  $auditLog
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, AuditLog $auditLog)
    {
        // Admin/owner can view all audit logs
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view audit logs in their outlet
        return $user->outlet_id === $auditLog->outlet_id;
    }
}