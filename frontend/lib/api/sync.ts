import axios from "axios"

export interface SyncStatus {
  last_sync_at: string | null
  last_sync_status: "success" | "failed" | "in_progress" | "idle"
  last_sync_message?: string
  pending_changes: number
  last_upload_at: string | null
  last_upload_status: "success" | "failed" | "in_progress" | "idle"
  last_upload_message?: string
  pending_uploads: number
  last_download_at: string | null
  last_download_status: "success" | "failed" | "in_progress" | "idle"
  last_download_message?: string
  pending_downloads: number
}

export interface SyncLog {
  id: number
  type: "upload" | "download"
  status: "success" | "failed" | "in_progress"
  entity_type: string
  entity_id: number
  message?: string
  created_at: string
  updated_at: string
}

export interface OfflineData {
  customers: number
  products: number
  product_variants: number
  transactions: number
  transaction_items: number
  settings: number
  last_updated: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class SyncService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/sync`,
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

  // Get sync status
  async getSyncStatus(): Promise<{ data: SyncStatus; message: string }> {
    try {
      const response = await this.axiosInstance.get("/status")
      return response.data
    } catch (error) {
      console.error("Error fetching sync status:", error)
      throw error
    }
  }

  // Get sync logs
  async getSyncLogs(
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ data: SyncLog[]; message: string }> {
    try {
      const params = new URLSearchParams()
      params.append("limit", limit.toString())
      params.append("offset", offset.toString())

      const response = await this.axiosInstance.get(
        `/logs?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching sync logs:", error)
      throw error
    }
  }

  // Get offline data status
  async getOfflineDataStatus(): Promise<{
    data: OfflineData
    message: string
  }> {
    try {
      const response = await this.axiosInstance.get("/offline-data")
      return response.data
    } catch (error) {
      console.error("Error fetching offline data status:", error)
      throw error
    }
  }

  // Start manual sync
  async startSync(
    direction: "both" | "upload" | "download" = "both",
  ): Promise<{ data: SyncStatus; message: string }> {
    try {
      const response = await this.axiosInstance.post(`/start`, { direction })
      return response.data
    } catch (error) {
      console.error("Error starting sync:", error)
      throw error
    }
  }

  // Check online status
  async checkOnlineStatus(): Promise<{
    data: { online: boolean; message: string }
    message: string
  }> {
    try {
      const response = await this.axiosInstance.get("/check-online")
      return response.data
    } catch (error) {
      console.error("Error checking online status:", error)
      throw error
    }
  }

  // Clear sync logs
  async clearSyncLogs(): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.delete("/logs")
      return response.data
    } catch (error) {
      console.error("Error clearing sync logs:", error)
      throw error
    }
  }

  // Clear offline data
  async clearOfflineData(): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.delete("/offline-data")
      return response.data
    } catch (error) {
      console.error("Error clearing offline data:", error)
      throw error
    }
  }

  // Get sync statistics
  async getSyncStatistics(): Promise<{
    data: {
      total_syncs: number
      successful_syncs: number
      failed_syncs: number
      last_7_days_syncs: {
        date: string
        success_count: number
        failed_count: number
      }[]
      sync_by_type: {
        upload: number
        download: number
        both: number
      }
    }
    message: string
  }> {
    try {
      const response = await this.axiosInstance.get("/statistics")
      return response.data
    } catch (error) {
      console.error("Error fetching sync statistics:", error)
      throw error
    }
  }

  // Configure sync settings
  async configureSyncSettings(settings: {
    auto_sync_enabled: boolean
    auto_sync_interval_minutes: number
    sync_on_startup: boolean
    sync_on_online: boolean
    max_retries: number
    retry_delay_seconds: number
  }): Promise<{ data: SyncStatus; message: string }> {
    try {
      const response = await this.axiosInstance.post("/configure", settings)
      return response.data
    } catch (error) {
      console.error("Error configuring sync settings:", error)
      throw error
    }
  }

  // Get sync configuration
  async getSyncConfiguration(): Promise<{
    data: {
      auto_sync_enabled: boolean
      auto_sync_interval_minutes: number
      sync_on_startup: boolean
      sync_on_online: boolean
      max_retries: number
      retry_delay_seconds: number
    }
    message: string
  }> {
    try {
      const response = await this.axiosInstance.get("/configuration")
      return response.data
    } catch (error) {
      console.error("Error fetching sync configuration:", error)
      throw error
    }
  }
}

export const syncService = new SyncService()
