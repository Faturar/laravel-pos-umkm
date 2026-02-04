<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $categories = $this->categoryService->getAllCategories($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'data' => CategoryResource::collection($categories)
        ]);
    }

    /**
     * Store a newly created category in storage.
     *
     * @param  StoreCategoryRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->createCategory($request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category)
        ], 201);
    }

    /**
     * Display the specified category.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $category = $this->categoryService->getCategoryById($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Category retrieved successfully',
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Update the specified category in storage.
     *
     * @param  UpdateCategoryRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = $this->categoryService->updateCategory($id, $request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Remove the specified category from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
            'data' => null
        ]);
    }
}