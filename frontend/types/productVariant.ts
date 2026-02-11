export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  min_stock: number
  max_stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductVariantFormData {
  product_id: number
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  min_stock: number
  max_stock: number
  is_active: boolean
}
