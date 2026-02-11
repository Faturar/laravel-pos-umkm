// src/types/product.ts
export interface Product {
  id: number

  // Core info
  name: string
  description?: string | null
  sku: string
  barcode?: string | null
  image?: string | null

  // Pricing
  price: number // decimal:2 → number in TS
  cost: number // decimal:2 → number in TS

  // Stock
  track_stock: boolean
  stock_quantity: number
  stock_alert_threshold: number

  // Status
  is_active: boolean

  // Relations (IDs)
  category_id: number | null
  outlet_id: number

  // Optional populated relations (API dependent)
  category?: {
    id: number
    name: string
    description?: string | null
    color?: string | null
    is_active: boolean
  }

  outlet?: {
    id: number
    name: string
    code: string
    address?: string | null
    phone?: string | null
    email?: string | null
    is_active: boolean
    tax_rate: number
    service_charge_rate: number
  }

  // Timestamps (if API returns them)
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Product Variant interface
export interface ProductVariant {
  id: number
  name: string
  description?: string | null
  price: number
  cost: number
  sku: string
  barcode?: string | null
  is_active: boolean
  stock_quantity: number
  stock_alert_threshold: number
  product_id: number
  product?: Product
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Stock Movement interface
export interface StockMovement {
  id: number
  type: "in" | "out" | "adjustment"
  quantity: number
  before_quantity: number
  after_quantity: number
  notes?: string | null
  product_id: number
  product_variant_id?: number | null
  transaction_id?: number | null
  user_id: number
  outlet_id: number
  product?: Product
  product_variant?: ProductVariant
  transaction?: {
    id: number
    reference_number: string
  }
  user?: {
    id: number
    name: string
  }
  outlet?: {
    id: number
    name: string
  }
  created_at?: string
  updated_at?: string
}
