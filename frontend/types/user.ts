export interface User {
  id: number
  name: string
  email: string
  username: string
  phone?: string
  is_active: boolean
  current_outlet_id?: number
  current_outlet_name?: string
  last_login_at?: string
  roles?: Role[]
  created_at: string
  updated_at: string
}

export interface UserFormData {
  name: string
  email: string
  username: string
  phone?: string
  password: string
  password_confirmation: string
  is_active: boolean
  current_outlet_id?: number
  role_ids: number[]
}

export interface UserUpdateFormData {
  name: string
  email: string
  username: string
  phone?: string
  is_active: boolean
  current_outlet_id?: number
  role_ids: number[]
}

export interface Role {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}
