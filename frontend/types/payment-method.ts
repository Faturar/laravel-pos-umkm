export interface PaymentMethod {
  id: number
  name: string
  type:
    | "Cash"
    | "QRIS"
    | "E-Wallet"
    | "Bank Transfer"
    | "Credit Card"
    | "Debit Card"
  fee_type: "None" | "Fixed Amount" | "Percentage"
  fee_value: number
  is_default: boolean
  is_active: boolean
  outlet_id: number
  outlet?: {
    id: number
    name: string
    code: string
  }
  created_at: string
  updated_at: string
}
