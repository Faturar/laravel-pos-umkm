export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Outlet {
  id: number
  name: string
  address?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  sku: string
  barcode: string
  description?: string
  price: number
  cost: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  barcode: string
  price: number
  cost: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface TransactionItem {
  id: number
  transaction_id: number
  product_id?: number
  product?: Product
  product_variant_id?: number
  variant?: ProductVariant
  quantity: number
  price: number
  discount_amount: number
  tax_amount: number
  total_price: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  uuid: string
  invoice_number: string
  customer_id?: number
  customer?: Customer
  outlet_id: number
  outlet?: Outlet
  user_id?: number
  user?: User
  subtotal: number
  discount_amount: number
  tax_amount: number
  service_charge_amount: number
  final_amount: number
  paid_amount: number
  change_amount: number
  payment_method: string
  payment_reference?: string
  notes?: string
  status: string
  is_void: boolean
  is_refund: boolean
  void_reason?: string
  refund_reason?: string
  is_synced: boolean
  created_at: string
  updated_at: string
  items?: TransactionItem[]
}

export interface TransactionApiResponse {
  data: Transaction[]
  message?: string
  status: number
  success: boolean
}

export interface SingleTransactionApiResponse {
  data: Transaction
  message?: string
  status: number
  success: boolean
}

export interface TransactionQueryParams {
  page?: number
  per_page?: number
  search?: string
  outlet_id?: number
  cashier_id?: number
  payment_method?: string
  status?: string
  from_date?: string
  to_date?: string
  sort_by?: string
  sort_direction?: "asc" | "desc"
}
