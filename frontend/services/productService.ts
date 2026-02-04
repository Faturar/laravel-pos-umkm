import { api } from "@/lib/api"
import {
  Product,
  ProductApiResponse,
  SingleProductApiResponse,
  ProductQueryParams,
} from "@/types/product"

class ProductService {
  // Get all products with pagination and filtering
  async getProducts(params?: ProductQueryParams): Promise<ProductApiResponse> {
    const response = await api.get<Product[]>("/products", {
      params: params as Record<string, unknown>,
    })
    return response
  }

  // Get a single product by ID
  async getProductById(id: number): Promise<SingleProductApiResponse> {
    const response = await api.get<Product>(`/products/${id}`)
    return response
  }

  // Create a new product
  async createProduct(
    productData: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<SingleProductApiResponse> {
    const response = await api.post<Product>("/products", productData)
    return response
  }

  // Update an existing product
  async updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<SingleProductApiResponse> {
    const response = await api.put<Product>(`/products/${id}`, productData)
    return response
  }

  // Delete a product
  async deleteProduct(id: number): Promise<{
    data: null
    message?: string
    status: number
    success: boolean
  }> {
    const response = await api.delete(`/products/${id}`)
    return {
      ...response,
      data: null,
    }
  }

  // Search products
  async searchProducts(
    query: string,
    categoryId?: number,
    outletId?: number,
  ): Promise<ProductApiResponse> {
    const params: ProductQueryParams = {
      search: query,
      category_id: categoryId,
      outlet_id: outletId,
    }
    const response = await api.get<Product[]>("/products/search", {
      params: params as Record<string, unknown>,
    })
    return response
  }

  // Update product stock
  async updateProductStock(
    id: number,
    quantity: number,
    notes?: string,
  ): Promise<SingleProductApiResponse> {
    const response = await api.put<Product>(`/products/${id}/stock`, {
      quantity,
      notes,
    })
    return response
  }
}

export const productService = new ProductService()
