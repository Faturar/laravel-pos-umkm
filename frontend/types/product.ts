export interface Category {
  id: number
  name: string
  description?: string
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

export interface Product {
  id: number
  name: string
  sku: string
  barcode: string
  description?: string
  category_id: number
  category?: Category
  outlet_id: number
  outlet?: Outlet
  price: number
  cost: number
  stock: number
  min_stock: number
  unit: string
  is_active: boolean
  has_variants: boolean
  variants?: ProductVariant[]
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
  stock: number
  min_stock: number
  unit: string
  is_active: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

export interface ProductApiResponse {
  data: Product[]
  message?: string
  status: number
  success: boolean
}

export interface SingleProductApiResponse {
  data: Product
  message?: string
  status: number
  success: boolean
}

export interface ProductQueryParams {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  outlet_id?: number
  sort_by?: string
  sort_direction?: "asc" | "desc"
}
