export interface Product {
  id: number
  name: string
  code: string
  sku?: string
  barcode?: string
  description?: string
  price: number
  cost: number
  category_id: number
  category?: {
    id: number
    name: string
  }
  outlet_id?: number
  outlet?: {
    id: number
    name: string
  }
  stock_quantity: number
  stock_alert_threshold: number
  track_stock: boolean
  is_active: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: number
  product_id: number
  type: "in" | "out" | "adjustment"
  quantity: number
  before_quantity: number
  after_quantity: number
  notes?: string
  user_id: number
  outlet_id: number
  user?: {
    id: number
    name: string
  }
  outlet?: {
    id: number
    name: string
  }
  transaction_id?: number
  transaction?: {
    id: number
    reference_number: string
  }
  created_at: string
}
