export interface Transaction {
  id: number
  uuid: string
  invoice_number: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  service_charge_amount: number
  total_amount: number
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
  cashier_id: number
  customer_id?: number
  outlet_id: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
