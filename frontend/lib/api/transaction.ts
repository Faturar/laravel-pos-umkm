import {
  Transaction,
  TransactionItem,
  TransactionFormData,
} from "@/types/transaction"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class TransactionService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getTransactions(params?: {
    page?: number
    per_page?: number
    search?: string
    start_date?: string
    end_date?: string
    outlet_id?: number
    status?: string
    cashier_id?: number
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
        `${API_BASE_URL}/transactions?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  }

  async getTransaction(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transaction")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transaction:", error)
      throw error
    }
  }

  async createTransaction(data: TransactionFormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create transaction")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  }

  async updateTransaction(id: number, data: Partial<TransactionFormData>) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update transaction")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    }
  }

  async voidTransaction(id: number, reason: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}/void`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({ void_reason: reason }),
      })

      if (!response.ok) {
        throw new Error("Failed to void transaction")
      }

      return await response.json()
    } catch (error) {
      console.error("Error voiding transaction:", error)
      throw error
    }
  }

  async refundTransaction(
    id: number,
    data: {
      refund_amount: number
      refund_reason: string
      items?: Array<{
        transaction_item_id: number
        quantity: number
        amount: number
      }>
    },
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transactions/${id}/refund`,
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
        throw new Error("Failed to refund transaction")
      }

      return await response.json()
    } catch (error) {
      console.error("Error refunding transaction:", error)
      throw error
    }
  }

  async getDailySummary(params?: { date?: string; outlet_id?: number }) {
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
        `${API_BASE_URL}/transactions/daily-summary?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch daily summary")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching daily summary:", error)
      throw error
    }
  }

  async getTransactionStatistics(params?: {
    start_date?: string
    end_date?: string
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
        `${API_BASE_URL}/transactions/statistics?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch transaction statistics")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transaction statistics:", error)
      throw error
    }
  }

  async generateReceipt(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to generate receipt")
      }

      return await response.json()
    } catch (error) {
      console.error("Error generating receipt:", error)
      throw error
    }
  }
}

export const transactionService = new TransactionService()
