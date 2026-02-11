import { ProductVariant, ProductVariantFormData } from "@/types/productVariant"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ProductVariantService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getProductVariants(params?: {
    page?: number
    per_page?: number
    search?: string
    product_id?: number
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
        `${API_BASE_URL}/product-variants?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch product variants")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching product variants:", error)
      throw error
    }
  }

  async getProductVariant(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/product-variants/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch product variant")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching product variant:", error)
      throw error
    }
  }

  async createProductVariant(data: ProductVariantFormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/product-variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create product variant")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating product variant:", error)
      throw error
    }
  }

  async updateProductVariant(
    id: number,
    data: Partial<ProductVariantFormData>,
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/product-variants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update product variant")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating product variant:", error)
      throw error
    }
  }

  async deleteProductVariant(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/product-variants/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete product variant")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting product variant:", error)
      throw error
    }
  }

  async updateStock(id: number, quantity: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product-variants/${id}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify({ quantity }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update product variant stock")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating product variant stock:", error)
      throw error
    }
  }
}

export const productVariantService = new ProductVariantService()
