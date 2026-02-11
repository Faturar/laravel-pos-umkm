import { User, UserFormData, UserUpdateFormData, Role } from "@/types/user"
import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class UserService {
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async getUsers(params?: {
    page?: number
    per_page?: number
    search?: string
    is_active?: boolean
    role_id?: number
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

      const response = await axios.get(
        `${API_BASE_URL}/users?${searchParams.toString()}`,
        {
          headers: this.getAuthHeaders(),
        },
      )

      return response.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  }

  async getUser(id: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error("Error fetching user:", error)
      throw error
    }
  }

  async createUser(data: UserFormData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, data, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  async updateUser(id: number, data: UserUpdateFormData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      })

      return response.data
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  async deleteUser(id: number) {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }

  async assignRoles(id: number, roleIds: number[]) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/${id}/roles`,
        { role_ids: roleIds },
        {
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error assigning roles to user:", error)
      throw error
    }
  }

  async getAvailableRoles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/roles`, {
        headers: this.getAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error("Error fetching available roles:", error)
      throw error
    }
  }

  async getAvailableOutlets() {
    try {
      const response = await axios.get(`${API_BASE_URL}/outlets`, {
        headers: this.getAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error("Error fetching available outlets:", error)
      throw error
    }
  }

  async resetPassword(
    id: number,
    data: { password: string; password_confirmation: string },
  ) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/${id}/reset-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error resetting user password:", error)
      throw error
    }
  }
}

export const userService = new UserService()
