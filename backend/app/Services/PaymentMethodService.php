<?php

namespace App\Services;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;

class PaymentMethodService
{
    /**
     * Get all payment methods with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPaymentMethods(array $filters = [])
    {
        $query = PaymentMethod::query();

        // Apply filters
        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['status'])) {
            $query->where('is_active', $filters['status'] === 'active');
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['outlet_id'])) {
            $query->where('outlet_id', $filters['outlet_id']);
        }

        return $query->latest()->get();
    }

    /**
     * Get a payment method by ID.
     *
     * @param int $id
     * @return PaymentMethod
     */
    public function getPaymentMethodById(int $id)
    {
        return PaymentMethod::findOrFail($id);
    }

    /**
     * Create a new payment method.
     *
     * @param array $data
     * @return PaymentMethod
     */
    public function createPaymentMethod(array $data)
    {
        return DB::transaction(function () use ($data) {
            // If this is set as default, remove default from other payment methods
            if (isset($data['is_default']) && $data['is_default']) {
                PaymentMethod::where('is_default', true)->update(['is_default' => false]);
            }

            return PaymentMethod::create($data);
        });
    }

    /**
     * Update a payment method.
     *
     * @param int $id
     * @param array $data
     * @return PaymentMethod
     */
    public function updatePaymentMethod(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $paymentMethod = PaymentMethod::findOrFail($id);

            // If this is set as default, remove default from other payment methods
            if (isset($data['is_default']) && $data['is_default']) {
                PaymentMethod::where('is_default', true)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
            }

            $paymentMethod->update($data);

            return $paymentMethod;
        });
    }

    /**
     * Delete a payment method.
     *
     * @param int $id
     * @return bool
     */
    public function deletePaymentMethod(int $id)
    {
        $paymentMethod = PaymentMethod::findOrFail($id);
        
        // If this is the default payment method, prevent deletion
        if ($paymentMethod->is_default) {
            throw new \Exception('Cannot delete the default payment method');
        }

        return $paymentMethod->delete();
    }

    /**
     * Get summary statistics for payment methods.
     *
     * @return array
     */
    public function getPaymentMethodSummary()
    {
        $total = PaymentMethod::count();
        $active = PaymentMethod::where('is_active', true)->count();
        $inactive = $total - $active;
        $withFees = PaymentMethod::where('fee_type', '!=', 'None')->count();
        $default = PaymentMethod::where('is_default', true)->count();

        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'with_fees' => $withFees,
            'default' => $default,
        ];
    }
}