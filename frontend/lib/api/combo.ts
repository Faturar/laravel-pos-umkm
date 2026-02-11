import { Combo, ComboFormData } from "@/types/combo"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ComboService {
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

  async getCombos(params?: {
    page?: number
    per_page?: number
    search?: string
    is_active?: boolean
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
        `${API_BASE_URL}/combos?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch combos")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching combos:", error)
      throw error
    }
  }

  async getCombo(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch combo")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching combo:", error)
      throw error
    }
  }

  async createCombo(data: ComboFormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create combo")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating combo:", error)
      throw error
    }
  }

  async updateCombo(id: number, data: Partial<ComboFormData>) {
    try {
      const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update combo")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating combo:", error)
      throw error
    }
  }

  async deleteCombo(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete combo")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting combo:", error)
      throw error
    }
  }

  async checkComboStock(id: number, quantity: number = 1) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/combos/${id}/check-stock?quantity=${quantity}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to check combo stock")
      }

      return await response.json()
    } catch (error) {
      console.error("Error checking combo stock:", error)
      throw error
    }
  }

  async getActiveCombosByOutlet(outletId?: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/combos/outlet/${outletId || "all"}/active`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch active combos")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching active combos:", error)
      throw error
    }
  }
}

export const comboService = new ComboService()
