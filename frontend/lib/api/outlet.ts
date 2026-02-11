import { Outlet, OutletFormData, OutletStatistics } from "@/types/outlet"
import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class OutletService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getOutlets() {
    try {
      const response = await axios.get(`${API_BASE_URL}/outlets`, {
        headers: this.getAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error("Error fetching outlets:", error)
      throw error
    }
  }

  async getOutlet(id: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/outlets/${id}`, {
        headers: this.getAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error("Error fetching outlet:", error)
      throw error
    }
  }

  async createOutlet(data: OutletFormData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/outlets`, data, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating outlet:", error)
      throw error
    }
  }

  async updateOutlet(id: number, data: OutletFormData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/outlets/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      })

      return response.data
    } catch (error) {
      console.error("Error updating outlet:", error)
      throw error
    }
  }

  async deleteOutlet(id: number) {
    try {
      await axios.delete(`${API_BASE_URL}/outlets/${id}`, {
        headers: this.getAuthHeaders(),
      })
    } catch (error) {
      console.error("Error deleting outlet:", error)
      throw error
    }
  }

  async getOutletStatistics(id: number) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/outlets/${id}/statistics`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      return response.data
    } catch (error) {
      console.error("Error fetching outlet statistics:", error)
      throw error
    }
  }

  async switchOutlet(id: number) {
    try {
      await axios.post(
        `${API_BASE_URL}/outlets/${id}/switch`,
        {},
        {
          headers: this.getAuthHeaders(),
        },
      )
    } catch (error) {
      console.error("Error switching outlet:", error)
      throw error
    }
  }
}

export const outletService = new OutletService()
