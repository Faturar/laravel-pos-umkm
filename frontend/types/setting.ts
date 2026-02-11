export interface Setting {
  id: number
  key: string
  value: string
  description?: string
  updated_by?: number
  updated_at?: string
  created_at: string
}

export interface SettingFormData {
  key: string
  value: string
  description?: string
}

export interface POSSetting extends Setting {
  category: string
  type: "string" | "number" | "boolean" | "json"
  options?: string[]
}
