import axios from "axios"

export interface Customer {
  id: number
  name: string
  email?: string
  phone: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  created_at: string
  updated_at: string
}

export interface CustomerFormData {
  name: string
  email?: string
  phone: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class CustomerService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/customers`,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor to include JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token")
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Add response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // Get all customers
  async getCustomers(params?: {
    page?: number
    per_page?: number
    search?: string
  }): Promise<{
    data: Customer[]
    meta: { page: number; per_page: number; total: number; total_pages: number }
  }> {
    try {
      const response = await this.axiosInstance.get("", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching customers:", error)
      throw error
    }
  }

  // Get a single customer by ID
  async getCustomer(id: number): Promise<{ data: Customer }> {
    try {
      const response = await this.axiosInstance.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching customer:", error)
      throw error
    }
  }

  // Create a new customer
  async createCustomer(data: CustomerFormData): Promise<{ data: Customer }> {
    try {
      const response = await this.axiosInstance.post("", data)
      return response.data
    } catch (error) {
      console.error("Error creating customer:", error)
      throw error
    }
  }

  // Update an existing customer
  async updateCustomer(
    id: number,
    data: CustomerFormData,
  ): Promise<{ data: Customer }> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, data)
      return response.data
    } catch (error) {
      console.error("Error updating customer:", error)
      throw error
    }
  }

  // Delete a customer
  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`)
    } catch (error) {
      console.error("Error deleting customer:", error)
      throw error
    }
  }
}

export const customerService = new CustomerService()
