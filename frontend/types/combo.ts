export interface Combo {
  id: number
  name: string
  price: number
  is_active: boolean
  outlet_id?: number
  outlet?: {
    id: number
    name: string
  }
  items: ComboItem[]
  created_at: string
  updated_at: string
}

export interface ComboItem {
  id: number
  combo_id: number
  product_id: number
  product: {
    id: number
    name: string
    sku: string
    price: number
    cost: number
    stock: number
  }
  variant_id?: number
  variant?: {
    id: number
    name: string
    sku: string
    price: number
    cost: number
    stock: number
  }
  qty: number
}

export interface ComboFormData {
  name: string
  price: number
  is_active: boolean
  outlet_id?: number
  items: ComboItemFormData[]
}

export interface ComboItemFormData {
  product_id: number
  variant_id?: number
  qty: number
}
