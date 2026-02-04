// API utility functions for HTTP requests using Axios

import axios from "axios"

interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: number
  success: boolean
}

interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  [key: string]: unknown
}

class ApiClient {
  private axiosInstance: ReturnType<typeof axios.create>

  constructor(
    baseURL: string = (process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8000") + "/api",
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get token from cookies
        if (typeof window !== "undefined") {
          const getTokenFromCookies = () => {
            const cookies = document.cookie.split(";")
            console.log("Available cookies:", cookies)

            const tokenCookie = cookies.find((cookie) =>
              cookie.trim().startsWith("token="),
            )
            const jwtTokenCookie = cookies.find((cookie) =>
              cookie.trim().startsWith("jwt_token="),
            )

            const token = tokenCookie
              ? tokenCookie.split("=")[1]
              : jwtTokenCookie
                ? jwtTokenCookie.split("=")[1]
                : null

            console.log("Found token:", token ? "Yes" : "No")
            return token
          }

          const token = getTokenFromCookies()

          if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
            console.log(
              "Authorization header set:",
              `Bearer ${token.substring(0, 10)}...`,
            )
          } else {
            console.log("No token found in cookies")
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
      (response) => {
        return response
      },
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorData = error.response.data
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            error.response.statusText ||
            "Request failed"

          error.message = errorMessage
        } else if (error.request) {
          // The request was made but no response was received
          error.message = "No response received from server"
        } else {
          // Something happened in setting up the request that triggered an Error
          error.message = "Error setting up request"
        }

        return Promise.reject(error)
      },
    )
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...options,
      })

      return {
        data: response.data,
        status: response.status,
        success: response.status >= 200 && response.status < 300,
      }
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      data,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      data,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      data,
    })
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  // Special method for file uploads
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      data: formData,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
    })
  }
}

// Create and export API client instance
export const apiClient = new ApiClient()

// Export convenience functions for direct usage
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient.get<T>(endpoint, options),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.post<T>(endpoint, data, options),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.put<T>(endpoint, data, options),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.patch<T>(endpoint, data, options),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient.delete<T>(endpoint, options),
  upload: <T>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    apiClient.upload<T>(endpoint, formData, options),
}
