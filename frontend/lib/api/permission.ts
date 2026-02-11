import axios from "axios"

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
  module: string
  created_at: string
  updated_at: string
}

export interface PermissionFormData {
  name: string
  display_name: string
  description?: string
  module: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class PermissionService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/permissions`,
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

  // Get all permissions
  async getPermissions(): Promise<{ data: Permission[]; message: string }> {
    try {
      const response = await this.axiosInstance.get("")
      return response.data
    } catch (error) {
      console.error("Error fetching permissions:", error)
      throw error
    }
  }

  // Get permission by ID
  async getPermissionById(
    id: number,
  ): Promise<{ data: Permission; message: string }> {
    try {
      const response = await this.axiosInstance.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching permission with ID ${id}:`, error)
      throw error
    }
  }

  // Create new permission
  async createPermission(
    permissionData: PermissionFormData,
  ): Promise<{ data: Permission; message: string }> {
    try {
      const response = await this.axiosInstance.post("", permissionData)
      return response.data
    } catch (error) {
      console.error("Error creating permission:", error)
      throw error
    }
  }

  // Update permission
  async updatePermission(
    id: number,
    permissionData: PermissionFormData,
  ): Promise<{ data: Permission; message: string }> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, permissionData)
      return response.data
    } catch (error) {
      console.error(`Error updating permission with ID ${id}:`, error)
      throw error
    }
  }

  // Delete permission
  async deletePermission(id: number): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.delete(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting permission with ID ${id}:`, error)
      throw error
    }
  }

  // Get permissions by module
  async getPermissionsByModule(
    module: string,
  ): Promise<{ data: Permission[]; message: string }> {
    try {
      const response = await this.axiosInstance.get(`/module/${module}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching permissions for module ${module}:`, error)
      throw error
    }
  }

  // Get all permission modules
  async getPermissionModules(): Promise<{ data: string[]; message: string }> {
    try {
      const response = await this.axiosInstance.get("/modules")
      return response.data
    } catch (error) {
      console.error("Error fetching permission modules:", error)
      throw error
    }
  }
}

export const permissionService = new PermissionService()
