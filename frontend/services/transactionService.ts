import { api } from "@/lib/api"
import {
  Transaction,
  TransactionApiResponse,
  SingleTransactionApiResponse,
  TransactionQueryParams,
} from "@/types/transaction"

interface DailySummaryResponse {
  total_transactions: number
  total_revenue: number
  total_items_sold: number
  average_transaction_value: number
  payment_methods: Record<string, number>
}

interface StatisticsResponse {
  today: {
    total_transactions: number
    total_sales: number
    average_transaction: number
  }
  this_week: {
    total_transactions: number
    total_sales: number
    average_transaction: number
  }
  this_month: {
    total_transactions: number
    total_sales: number
    average_transaction: number
  }
  this_year: {
    total_transactions: number
    total_sales: number
    average_transaction: number
  }
}

interface ReceiptData {
  invoice_number: string
  date: string
  cashier: string
  outlet: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  paid: number
  change: number
  payment_method: string
}

class TransactionService {
  // Get all transactions with pagination and filtering
  async getTransactions(
    params?: TransactionQueryParams,
  ): Promise<TransactionApiResponse> {
    const response = await api.get<Transaction[]>("/transactions", {
      params: params as Record<string, unknown>,
    })
    return response
  }

  // Get a single transaction by ID
  async getTransactionById(id: number): Promise<SingleTransactionApiResponse> {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response
  }

  // Create a new transaction
  async createTransaction(
    transactionData: Omit<
      Transaction,
      "id" | "uuid" | "invoice_number" | "created_at" | "updated_at"
    >,
  ): Promise<SingleTransactionApiResponse> {
    const response = await api.post<Transaction>(
      "/transactions",
      transactionData,
    )
    return response
  }

  // Update an existing transaction
  async updateTransaction(
    id: number,
    transactionData: Partial<Transaction>,
  ): Promise<SingleTransactionApiResponse> {
    const response = await api.put<Transaction>(
      `/transactions/${id}`,
      transactionData,
    )
    return response
  }

  // Void a transaction
  async voidTransaction(
    id: number,
    reason: string,
  ): Promise<SingleTransactionApiResponse> {
    const response = await api.post<Transaction>(`/transactions/${id}/void`, {
      reason,
    })
    return response
  }

  // Refund a transaction
  async refundTransaction(
    id: number,
    refundData: {
      refund_amount: number
      refund_reason: string
      payment_reference?: string
      items_to_refund?: number[]
    },
  ): Promise<SingleTransactionApiResponse> {
    const response = await api.post<Transaction>(
      `/transactions/${id}/refund`,
      refundData,
    )
    return response
  }

  // Get daily summary of transactions
  async getDailySummary(
    date?: string,
    outletId?: number,
  ): Promise<{
    data: DailySummaryResponse
    message?: string
    status: number
    success: boolean
  }> {
    const params: Record<string, unknown> = {}
    if (date) params.date = date
    if (outletId) params.outlet_id = outletId

    const response = await api.get<DailySummaryResponse>(
      "/transactions/daily-summary",
      { params },
    )
    return response
  }

  // Get transaction statistics
  async getStatistics(outletId?: number): Promise<{
    data: StatisticsResponse
    message?: string
    status: number
    success: boolean
  }> {
    const params: Record<string, unknown> = {}
    if (outletId) params.outlet_id = outletId

    const response = await api.get<StatisticsResponse>(
      "/transactions/statistics",
      { params },
    )
    return response
  }

  // Generate receipt for a transaction
  async generateReceipt(id: number): Promise<{
    data: ReceiptData
    message?: string
    status: number
    success: boolean
  }> {
    const response = await api.get<ReceiptData>(`/transactions/${id}/receipt`)
    return response
  }
}

export const transactionService = new TransactionService()
