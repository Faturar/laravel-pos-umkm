const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface StockMovementFilters {
  page?: number
  per_page?: number
  search?: string
  movement_type?: string
  start_date?: string
  end_date?: string
  outlet_id?: number
  product_id?: number
}

interface StockMovementSummary {
  total_stock_in: number
  total_stock_out: number
  net_movement: number
  total_adjustments: number
}

interface StockMovementChartData {
  date: string
  stock_in: number
  stock_out: number
}

interface StockMovementByType {
  type: string
  value: number
}

interface AffectedProduct {
  name: string
  total_movement: number
  stock_in: number
  stock_out: number
}

class StockMovementService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getStockMovements(filters?: StockMovementFilters) {
    try {
      const searchParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/stock-movements?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch stock movements")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching stock movements:", error)
      throw error
    }
  }

  async getStockMovementSummary(
    filters?: Omit<StockMovementFilters, "page" | "per_page">,
  ) {
    try {
      const searchParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/summary?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch stock movement summary")
      }

      const data = await response.json()
      return data as StockMovementSummary
    } catch (error) {
      console.error("Error fetching stock movement summary:", error)
      throw error
    }
  }

  async getStockMovementChartData(
    filters?: Omit<StockMovementFilters, "page" | "per_page">,
  ) {
    try {
      const searchParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/chart-data?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch stock movement chart data")
      }

      const data = await response.json()
      return data as StockMovementChartData[]
    } catch (error) {
      console.error("Error fetching stock movement chart data:", error)
      throw error
    }
  }

  async getStockMovementByType(
    filters?: Omit<StockMovementFilters, "page" | "per_page">,
  ) {
    try {
      const searchParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/by-type?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch stock movement by type")
      }

      const data = await response.json()
      return data as StockMovementByType[]
    } catch (error) {
      console.error("Error fetching stock movement by type:", error)
      throw error
    }
  }

  async getAffectedProducts(
    filters?: Omit<StockMovementFilters, "page" | "per_page">,
  ) {
    try {
      const searchParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/affected-products?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch affected products")
      }

      const data = await response.json()
      return data as AffectedProduct[]
    } catch (error) {
      console.error("Error fetching affected products:", error)
      throw error
    }
  }

  async getStockMovementDetail(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-movements/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stock movement detail")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching stock movement detail:", error)
      throw error
    }
  }

  async createStockAdjustment(data: {
    product_id: number
    quantity: number
    reason: string
    outlet_id?: number
  }) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stock-movements/adjustment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify(data),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to create stock adjustment")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating stock adjustment:", error)
      throw error
    }
  }
}

export const stockMovementService = new StockMovementService()
