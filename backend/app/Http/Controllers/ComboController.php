<?php

namespace App\Http\Controllers;

use App\Http\Requests\Combo\StoreComboRequest;
use App\Http\Requests\Combo\UpdateComboRequest;
use App\Http\Resources\ComboResource;
use App\Models\Combo;
use App\Services\ComboService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ComboController extends Controller
{
    protected $comboService;

    public function __construct(ComboService $comboService)
    {
        $this->comboService = $comboService;
    }

    /**
     * Display a listing of the combos.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Combo::query();

        // Filter by outlet if provided
        if ($request->has('outlet_id')) {
            $query->where('outlet_id', $request->outlet_id);
        }

        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Include items in the response
        $combos = $query->with(['items.product', 'items.variant', 'outlet'])
            ->latest()
            ->paginate($request->input('per_page', 15));

        return ComboResource::collection($combos);
    }

    /**
     * Store a newly created combo.
     */
    public function store(StoreComboRequest $request): JsonResponse
    {
        $combo = $this->comboService->createCombo($request->all());

        return response()->json([
            'message' => 'Combo created successfully',
            'data' => new ComboResource($combo),
        ], 201);
    }

    /**
     * Display the specified combo.
     */
    public function show($id): JsonResponse
    {
        $combo = Combo::with(['items.product', 'items.variant', 'outlet'])->findOrFail($id);

        return response()->json([
            'data' => new ComboResource($combo),
        ]);
    }

    /**
     * Update the specified combo.
     */
    public function update(UpdateComboRequest $request, $id): JsonResponse
    {
        $combo = Combo::findOrFail($id);
        $updatedCombo = $this->comboService->updateCombo($combo, $request->all());

        return response()->json([
            'message' => 'Combo updated successfully',
            'data' => new ComboResource($updatedCombo),
        ]);
    }

    /**
     * Remove the specified combo.
     */
    public function destroy($id): JsonResponse
    {
        $combo = Combo::findOrFail($id);
        $this->comboService->deleteCombo($combo);

        return response()->json([
            'message' => 'Combo deleted successfully',
        ]);
    }

    /**
     * Check stock availability for a combo.
     */
    public function checkStock($id): JsonResponse
    {
        $combo = Combo::with(['items.product', 'items.variant'])->findOrFail($id);
        $quantity = request()->input('quantity', 1);
        
        $result = $this->comboService->checkComboStock($combo, $quantity);

        return response()->json($result);
    }

    /**
     * Get active combos for a specific outlet.
     */
    public function getActiveCombosByOutlet($outletId = null): AnonymousResourceCollection
    {
        $combos = $this->comboService->getActiveCombosByOutlet($outletId);

        return ComboResource::collection($combos);
    }
}