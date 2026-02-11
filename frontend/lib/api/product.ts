import { Product } from "@/types/product"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ProductService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getProducts(params?: {
    page?: number
    per_page?: number
    search?: string
    category_id?: number
    outlet_id?: number
    is_active?: boolean
  }) {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/products?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  async getProduct(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  async createProduct(data: {
    name: string
    code: string
    sku?: string
    barcode?: string
    description?: string
    price: number
    cost: number
    category_id: number
    stock_quantity?: number
    stock_alert_threshold?: number
    track_stock?: boolean
    is_active?: boolean
    image_url?: string
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  }

  async updateProduct(
    id: number,
    data: {
      name: string
      code: string
      sku?: string
      barcode?: string
      description?: string
      price: number
      cost: number
      category_id: number
      stock_quantity?: number
      stock_alert_threshold?: number
      track_stock?: boolean
      is_active?: boolean
      image_url?: string
    },
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  }

  async deleteProduct(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  }
}

export const productService = new ProductService()
