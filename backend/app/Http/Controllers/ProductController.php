<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Services\ProductService;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the products.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $products = $this->productService->getAllProducts($request->all());
        
        return ApiResponse::success(ProductResource::collection($products), 'Products retrieved successfully');
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  StoreProductRequest  $request
     * @return ProductResource
     */
    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->createProduct($request->validated());
        
        return ApiResponse::success(new ProductResource($product), 'Product created successfully', 201);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return ProductResource
     */
    public function show($id)
    {
        $product = $this->productService->getProductById($id);
        
        return ApiResponse::success(new ProductResource($product), 'Product retrieved successfully');
    }

    /**
     * Update the specified product in storage.
     *
     * @param  UpdateProductRequest  $request
     * @param  int  $id
     * @return ProductResource
     */
    public function update(UpdateProductRequest $request, $id)
    {
        $product = $this->productService->updateProduct($id, $request->validated());
        
        return ApiResponse::success(new ProductResource($product), 'Product updated successfully');
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->productService->deleteProduct($id);
        
        return ApiResponse::success(null, 'Product deleted successfully');
    }

    /**
     * Update stock for a product.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return ProductResource
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = $this->productService->updateProductStock(
            $id, 
            $request->quantity, 
            $request->notes
        );
        
        return ApiResponse::success(new ProductResource($product), 'Stock updated successfully');
    }

    /**
     * Search products by name or barcode.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'category_id' => 'nullable|exists:categories,id',
            'outlet_id' => 'nullable|exists:outlets,id',
        ]);

        $products = $this->productService->searchProducts(
            $request->input('query'),
            $request->input('category_id'),
            $request->input('outlet_id')
        );
        
        return ApiResponse::success(ProductResource::collection($products), 'Products retrieved successfully');
    }
}