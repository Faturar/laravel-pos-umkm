import { Product } from "@/types/product"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class InventoryService {
  private getAuthHeaders(): Record<string, string> {
    // In a real app, we would get the token from localStorage or a context
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getInventory(params?: {
    page?: number
    per_page?: number
    search?: string
    category_id?: number
    outlet_id?: number
    low_stock?: boolean
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
        `${API_BASE_URL}/inventory?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch inventory")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching inventory:", error)
      throw error
    }
  }

  async getLowStockProducts(params?: {
    page?: number
    per_page?: number
    outlet_id?: number
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
        `${API_BASE_URL}/inventory/low-stock?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch low stock products")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching low stock products:", error)
      throw error
    }
  }

  async getInventorySummary(outletId?: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/inventory/summary${outletId ? `?outlet_id=${outletId}` : ""}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch inventory summary")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching inventory summary:", error)
      throw error
    }
  }
}

export const inventoryService = new InventoryService()
