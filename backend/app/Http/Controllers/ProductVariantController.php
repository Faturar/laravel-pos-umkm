<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use App\Http\Resources\ProductVariantResource;
use App\Http\Requests\ProductVariant\StoreProductVariantRequest;
use App\Http\Requests\ProductVariant\UpdateProductVariantRequest;
use App\Services\ProductVariantService;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    protected $productVariantService;

    public function __construct(ProductVariantService $productVariantService)
    {
        $this->productVariantService = $productVariantService;
    }

    /**
     * Store a newly created product variant in storage.
     *
     * @param  StoreProductVariantRequest  $request
     * @param  int  $productId
     * @return ProductVariantResource
     */
    public function store(StoreProductVariantRequest $request, $productId)
    {
        $data = $request->validated();
        $data['product_id'] = $productId;
        
        $variant = $this->productVariantService->createProductVariant($data);
        
        return new ProductVariantResource($variant);
    }

    /**
     * Update the specified product variant in storage.
     *
     * @param  UpdateProductVariantRequest  $request
     * @param  int  $id
     * @return ProductVariantResource
     */
    public function update(UpdateProductVariantRequest $request, $id)
    {
        $variant = $this->productVariantService->updateProductVariant($id, $request->validated());
        
        return new ProductVariantResource($variant);
    }

    /**
     * Remove the specified product variant from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->productVariantService->deleteProductVariant($id);
        
        return response()->json(['message' => 'Product variant deleted successfully']);
    }

    /**
     * Update stock for a product variant.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return ProductVariantResource
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $variant = $this->productVariantService->updateProductVariantStock(
            $id, 
            $request->quantity, 
            $request->notes
        );
        
        return new ProductVariantResource($variant);
    }
}