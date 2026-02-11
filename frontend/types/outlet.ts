export interface Outlet {
  id: number
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  tax_rate: number
  service_charge_rate: number
  receipt_header?: string
  receipt_footer?: string
  created_at: string
  updated_at: string
}

export interface OutletFormData {
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  tax_rate: number
  service_charge_rate: number
  receipt_header?: string
  receipt_footer?: string
}

export interface OutletStatistics {
  total_transactions: number
  total_sales: number
  average_transaction: number
  total_customers?: number
  top_products?: Array<{
    product_id: number
    product_name: string
    quantity: number
    amount: number
  }>
  sales_by_payment_method?: Array<{
    payment_method: string
    count: number
    amount: number
  }>
  daily_sales?: Array<{
    date: string
    amount: number
  }>
  payment_methods?: Array<{
    name: string
    count: number
    total: number
  }>
  hourly_sales?: Array<{
    hour: number
    count: number
    total: number
  }>
}
