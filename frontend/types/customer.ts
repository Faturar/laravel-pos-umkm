export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CustomerFormData {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
  balance?: number
  is_active: boolean
  notes?: string
}
