import axios from "axios"

export interface AuditLog {
  id: number
  user_id: number
  user_name: string
  action: string
  entity_type: string
  entity_id: number
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address: string
  user_agent?: string
  created_at: string
}

export interface AuditLogFilters {
  user_id?: number
  action?: string
  entity_type?: string
  entity_id?: number
  date_from?: string
  date_to?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class AuditLogService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/audit-logs`,
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

  // Get all audit logs
  async getAuditLogs(
    filters?: AuditLogFilters,
  ): Promise<{ data: AuditLog[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      throw error
    }
  }

  // Get audit log by ID
  async getAuditLogById(
    id: number,
  ): Promise<{ data: AuditLog; message: string }> {
    try {
      const response = await this.axiosInstance.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching audit log with ID ${id}:`, error)
      throw error
    }
  }

  // Get audit logs by user
  async getAuditLogsByUser(
    userId: number,
    filters?: Omit<AuditLogFilters, "user_id">,
  ): Promise<{ data: AuditLog[]; message: string }> {
    try {
      const params = new URLSearchParams()
      params.append("user_id", userId.toString())

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching audit logs for user ${userId}:`, error)
      throw error
    }
  }

  // Get audit logs by entity
  async getAuditLogsByEntity(
    entityType: string,
    entityId: number,
  ): Promise<{ data: AuditLog[]; message: string }> {
    try {
      const params = new URLSearchParams()
      params.append("entity_type", entityType)
      params.append("entity_id", entityId.toString())

      const response = await this.axiosInstance.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(
        `Error fetching audit logs for entity ${entityType} with ID ${entityId}:`,
        error,
      )
      throw error
    }
  }

  // Get audit logs by action
  async getAuditLogsByAction(
    action: string,
  ): Promise<{ data: AuditLog[]; message: string }> {
    try {
      const params = new URLSearchParams()
      params.append("action", action)

      const response = await this.axiosInstance.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching audit logs for action ${action}:`, error)
      throw error
    }
  }

  // Get audit logs by date range
  async getAuditLogsByDateRange(
    dateFrom: string,
    dateTo: string,
  ): Promise<{ data: AuditLog[]; message: string }> {
    try {
      const params = new URLSearchParams()
      params.append("date_from", dateFrom)
      params.append("date_to", dateTo)

      const response = await this.axiosInstance.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(
        `Error fetching audit logs for date range ${dateFrom} to ${dateTo}:`,
        error,
      )
      throw error
    }
  }

  // Get available actions
  async getAvailableActions(): Promise<{ data: string[]; message: string }> {
    try {
      const response = await this.axiosInstance.get("/actions")
      return response.data
    } catch (error) {
      console.error("Error fetching available actions:", error)
      throw error
    }
  }

  // Get available entity types
  async getAvailableEntityTypes(): Promise<{
    data: string[]
    message: string
  }> {
    try {
      const response = await this.axiosInstance.get("/entity-types")
      return response.data
    } catch (error) {
      console.error("Error fetching available entity types:", error)
      throw error
    }
  }

  // Export audit logs
  async exportAuditLogs(
    filters?: AuditLogFilters,
    format: "csv" | "xlsx" = "csv",
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams()
      params.append("format", format)

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/export?${params.toString()}`,
        {
          responseType: "blob",
        },
      )

      return response.data
    } catch (error) {
      console.error("Error exporting audit logs:", error)
      throw error
    }
  }
}

export const auditLogService = new AuditLogService()
