<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Http\Resources\PaymentMethodResource;
use App\Http\Requests\PaymentMethod\StorePaymentMethodRequest;
use App\Http\Requests\PaymentMethod\UpdatePaymentMethodRequest;
use App\Services\PaymentMethodService;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    protected $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * Display a listing of the payment methods.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $paymentMethods = $this->paymentMethodService->getAllPaymentMethods($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Payment methods retrieved successfully',
            'data' => PaymentMethodResource::collection($paymentMethods)
        ]);
    }

    /**
     * Store a newly created payment method in storage.
     *
     * @param  StorePaymentMethodRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StorePaymentMethodRequest $request)
    {
        $paymentMethod = $this->paymentMethodService->createPaymentMethod($request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Payment method created successfully',
            'data' => new PaymentMethodResource($paymentMethod)
        ], 201);
    }

    /**
     * Display the specified payment method.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $paymentMethod = $this->paymentMethodService->getPaymentMethodById($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Payment method retrieved successfully',
            'data' => new PaymentMethodResource($paymentMethod)
        ]);
    }

    /**
     * Update the specified payment method in storage.
     *
     * @param  UpdatePaymentMethodRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdatePaymentMethodRequest $request, $id)
    {
        $paymentMethod = $this->paymentMethodService->updatePaymentMethod($id, $request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Payment method updated successfully',
            'data' => new PaymentMethodResource($paymentMethod)
        ]);
    }

    /**
     * Get payment method summary statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function summary()
    {
        $summary = $this->paymentMethodService->getPaymentMethodSummary();
        
        return response()->json([
            'success' => true,
            'message' => 'Payment method summary retrieved successfully',
            'data' => $summary
        ]);
    }

    /**
     * Remove the specified payment method from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->paymentMethodService->deletePaymentMethod($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Payment method deleted successfully',
            'data' => null
        ]);
    }
}