import axios from "axios"

export interface SalesSummary {
  total_sales: number
  total_transactions: number
  average_transaction_value: number
  date: string
}

export interface ProductSales {
  product_id: number
  product_name: string
  product_code: string
  quantity: number
  total_amount: number
  percentage_of_total: number
}

export interface ProductReportData {
  product_id: number
  product_name: string
  category_name?: string
  sku?: string
  quantity_sold: number
  total_revenue: number
  total_cost: number
  profit: number
  profit_margin: number
}

export interface PaymentMethodSummary {
  payment_method_id: number
  payment_method_name: number
  total_amount: number
  count: number
  percentage_of_total: number
}

export interface CashierSummary {
  user_id: number
  user_name: string
  total_sales: number
  total_transactions: number
  average_transaction_value: number
}

export interface InventoryReport {
  product_id: number
  product_name: string
  product_code: string
  category: string
  current_stock: number
  min_stock_level: number
  max_stock_level: number
  stock_value: number
  status: "low" | "normal" | "high"
}

export interface ComboReport {
  combo_id: number
  combo_name: number
  combo_code: string
  quantity: number
  total_amount: number
  percentage_of_total: number
}

export interface ReportFilters {
  date_from?: string
  date_to?: string
  outlet_id?: number
  category_id?: number
  payment_method_id?: number
  user_id?: number
  product_id?: number
  limit?: number
  offset?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ReportService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_URL}/reports`,
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

  // Get sales summary report
  async getSalesSummary(
    filters?: ReportFilters,
  ): Promise<{ data: SalesSummary[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/sales-summary?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching sales summary report:", error)
      throw error
    }
  }

  // Get sales by product report
  async getSalesByProduct(
    filters?: ReportFilters,
  ): Promise<{ data: ProductSales[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/sales-by-product?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching sales by product report:", error)
      throw error
    }
  }

  // Get product report
  async getProductReport(
    filters?: ReportFilters,
  ): Promise<{ data: ProductReportData[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/products?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching product report:", error)
      throw error
    }
  }

  // Get sales by payment method report
  async getSalesByPaymentMethod(
    filters?: ReportFilters,
  ): Promise<{ data: PaymentMethodSummary[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/sales-by-payment-method?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching sales by payment method report:", error)
      throw error
    }
  }

  // Get sales by cashier report
  async getSalesByCashier(
    filters?: ReportFilters,
  ): Promise<{ data: CashierSummary[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/sales-by-cashier?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching sales by cashier report:", error)
      throw error
    }
  }

  // Get cash flow report
  async getCashFlow(filters?: ReportFilters): Promise<{
    data: {
      opening_balance: number
      cash_in: number
      cash_out: number
      net_cash_flow: number
      closing_balance: number
      transactions: {
        id: number
        date: string
        type: "in" | "out"
        amount: number
        description: string
      }[]
    }
    message: string
  }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/cash-flow?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching cash flow report:", error)
      throw error
    }
  }

  // Get inventory report
  async getInventoryReport(
    filters?: ReportFilters,
  ): Promise<{ data: InventoryReport[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/inventory?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching inventory report:", error)
      throw error
    }
  }

  // Get combo sales report
  async getComboSales(
    filters?: ReportFilters,
  ): Promise<{ data: ComboReport[]; message: string }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/combo-sales?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching combo sales report:", error)
      throw error
    }
  }

  // Export report
  async exportReport(
    reportType: string,
    filters?: ReportFilters,
    format: "csv" | "xlsx" | "pdf" = "csv",
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
        `/${reportType}/export?${params.toString()}`,
        {
          responseType: "blob",
        },
      )

      return response.data
    } catch (error) {
      console.error(`Error exporting ${reportType} report:`, error)
      throw error
    }
  }

  // Get report dashboard data
  async getDashboardData(filters?: ReportFilters): Promise<{
    data: {
      total_sales: number
      total_transactions: number
      average_transaction_value: number
      top_products: ProductSales[]
      sales_by_day: SalesSummary[]
      sales_by_payment_method: PaymentMethodSummary[]
      sales_by_cashier: CashierSummary[]
    }
    message: string
  }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await this.axiosInstance.get(
        `/dashboard?${params.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      throw error
    }
  }
}

export const reportService = new ReportService()
