import { PaymentMethod } from "@/types/paymentMethod"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class PaymentMethodService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getPaymentMethods(params?: {
    page?: number
    per_page?: number
    search?: string
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
        `${API_BASE_URL}/payment-methods?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      throw error
    }
  }

  async getPaymentMethod(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch payment method")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching payment method:", error)
      throw error
    }
  }

  async createPaymentMethod(data: {
    name: string
    description?: string
    is_active?: boolean
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment method")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating payment method:", error)
      throw error
    }
  }

  async updatePaymentMethod(
    id: number,
    data: {
      name: string
      description?: string
      is_active?: boolean
    },
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update payment method")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating payment method:", error)
      throw error
    }
  }

  async deletePaymentMethod(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete payment method")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting payment method:", error)
      throw error
    }
  }
}

export const paymentMethodService = new PaymentMethodService()
