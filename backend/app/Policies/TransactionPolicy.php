<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any transactions.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('view_transactions');
    }

    /**
     * Determine whether the user can view the transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Transaction $transaction)
    {
        // Admin/owner can view all transactions
        if ($user->hasRole(['admin', 'owner'])) {
            return true;
        }
        
        // Regular users can only view transactions in their outlet
        return $user->outlet_id === $transaction->outlet_id;
    }

    /**
     * Determine whether the user can create transactions.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermission('create_transactions');
    }

    /**
     * Determine whether the user can update the transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Transaction $transaction)
    {
        // Admin/owner can update all transactions
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('edit_transactions');
        }
        
        // Regular users can only update transactions in their outlet
        return $user->outlet_id === $transaction->outlet_id && 
               $user->hasPermission('edit_transactions');
    }

    /**
     * Determine whether the user can void the transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function void(User $user, Transaction $transaction)
    {
        // Cannot void a transaction that is already voided
        if ($transaction->is_void) {
            return false;
        }
        
        // Admin/owner can void all transactions
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('void_transactions');
        }
        
        // Regular users can only void transactions in their outlet
        return $user->outlet_id === $transaction->outlet_id && 
               $user->hasPermission('void_transactions');
    }

    /**
     * Determine whether the user can refund the transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function refund(User $user, Transaction $transaction)
    {
        // Cannot refund a transaction that is already refunded or voided
        if ($transaction->is_refund || $transaction->is_void) {
            return false;
        }
        
        // Admin/owner can refund all transactions
        if ($user->hasRole(['admin', 'owner'])) {
            return $user->hasPermission('refund_transactions');
        }
        
        // Regular users can only refund transactions in their outlet
        return $user->outlet_id === $transaction->outlet_id && 
               $user->hasPermission('refund_transactions');
    }
}