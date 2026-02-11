import axios from "axios"
import { Role, Permission } from "@/types/user"
import { ApiResponse } from "@/types/api"

class RoleService {
  private baseUrl = "/api/roles"

  async getRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      console.error("Failed to fetch roles:", error)
      throw error
    }
  }

  async getRole(id: number): Promise<ApiResponse<Role>> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch role with id ${id}:`, error)
      throw error
    }
  }

  async createRole(data: {
    name: string
    description?: string
    is_active: boolean
  }): Promise<ApiResponse<Role>> {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error("Failed to create role:", error)
      throw error
    }
  }

  async updateRole(
    id: number,
    data: {
      name: string
      description?: string
      is_active: boolean
    },
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Failed to update role with id ${id}:`, error)
      throw error
    }
  }

  async deleteRole(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Failed to delete role with id ${id}:`, error)
      throw error
    }
  }

  async assignPermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${roleId}/permissions`,
        {
          permission_ids: permissionIds,
        },
      )
      return response.data
    } catch (error) {
      console.error(
        `Failed to assign permissions to role with id ${roleId}:`,
        error,
      )
      throw error
    }
  }

  async getAvailablePermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await axios.get(`${this.baseUrl}/permissions/available`)
      return response.data
    } catch (error) {
      console.error("Failed to fetch available permissions:", error)
      throw error
    }
  }
}

export const roleService = new RoleService()
