import axios from "axios"
import { Setting, SettingFormData, POSSetting } from "@/types/setting"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class SettingService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/settings`,
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

  // Get all settings
  async getSettings(): Promise<{ data: Setting[]; message: string }> {
    try {
      const response = await this.axiosInstance.get("")
      return response.data
    } catch (error) {
      console.error("Error fetching settings:", error)
      throw error
    }
  }

  // Get setting by ID
  async getSettingById(
    id: number,
  ): Promise<{ data: Setting; message: string }> {
    try {
      const response = await this.axiosInstance.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching setting with ID ${id}:`, error)
      throw error
    }
  }

  // Get setting by key
  async getSettingByKey(
    key: string,
  ): Promise<{ data: Setting; message: string }> {
    try {
      const response = await this.axiosInstance.get(`/key/${key}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching setting with key ${key}:`, error)
      throw error
    }
  }

  // Get POS settings
  async getPOSSettings(): Promise<{ data: Setting[]; message: string }> {
    try {
      const response = await this.axiosInstance.get("/pos")
      return response.data
    } catch (error) {
      console.error("Error fetching POS settings:", error)
      throw error
    }
  }

  // Create new setting
  async createSetting(
    settingData: SettingFormData,
  ): Promise<{ data: Setting; message: string }> {
    try {
      const response = await this.axiosInstance.post("", settingData)
      return response.data
    } catch (error) {
      console.error("Error creating setting:", error)
      throw error
    }
  }

  // Update setting
  async updateSetting(
    id: number,
    settingData: SettingFormData,
  ): Promise<{ data: Setting; message: string }> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, settingData)
      return response.data
    } catch (error) {
      console.error(`Error updating setting with ID ${id}:`, error)
      throw error
    }
  }

  // Delete setting
  async deleteSetting(id: number): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.delete(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting setting with ID ${id}:`, error)
      throw error
    }
  }

  // Bulk update settings
  async bulkUpdateSettings(
    settings: { id: number; value: string }[],
  ): Promise<{ data: Setting[]; message: string }> {
    try {
      const response = await this.axiosInstance.post("/bulk-update", {
        settings,
      })
      return response.data
    } catch (error) {
      console.error("Error bulk updating settings:", error)
      throw error
    }
  }
}

export const settingService = new SettingService()
