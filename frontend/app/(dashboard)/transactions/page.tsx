import { transactionColumns } from "./columns"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { Transaction } from "@/types/transaction"
import { Plus } from "lucide-react"

interface TransactionsPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
    payment_method?: string
  }
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const page = Number(searchParams.page ?? 1)
  const search = (searchParams.search ?? "").toLowerCase()
  const status = searchParams.status ?? "all"
  const paymentMethod = searchParams.payment_method ?? "all"

  // 🔥 DUMMY DATA SOURCE
  const allTransactions: Transaction[] = [
    {
      id: 1,
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      invoice_number: "INV-202402050001",
      subtotal: 120000,
      discount_amount: 0,
      tax_amount: 12000,
      service_charge_amount: 0,
      total_amount: 132000,
      final_amount: 132000,
      paid_amount: 150000,
      change_amount: 18000,
      payment_method: "cash",
      payment_reference: undefined,
      notes: "Customer requested extra sugar",
      status: "completed",
      is_void: false,
      is_refund: false,
      void_reason: undefined,
      refund_reason: undefined,
      is_synced: true,
      cashier_id: 1,
      customer_id: 1,
      outlet_id: 1,
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
      deleted_at: undefined,
    },
    {
      id: 2,
      uuid: "550e8400-e29b-41d4-a716-446655440001",
      invoice_number: "INV-202402050002",
      subtotal: 90000,
      discount_amount: 5000,
      tax_amount: 8500,
      service_charge_amount: 0,
      total_amount: 93500,
      final_amount: 93500,
      paid_amount: 100000,
      change_amount: 6500,
      payment_method: "card",
      payment_reference: "CARD-123456789",
      notes: undefined,
      status: "completed",
      is_void: false,
      is_refund: false,
      void_reason: undefined,
      refund_reason: undefined,
      is_synced: true,
      cashier_id: 1,
      customer_id: undefined,
      outlet_id: 1,
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
      deleted_at: undefined,
    },
    {
      id: 3,
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      invoice_number: "INV-202402050003",
      subtotal: 35000,
      discount_amount: 0,
      tax_amount: 3500,
      service_charge_amount: 0,
      total_amount: 38500,
      final_amount: 38500,
      paid_amount: 50000,
      change_amount: 11500,
      payment_method: "ewallet",
      payment_reference: "EWL-987654321",
      notes: undefined,
      status: "voided",
      is_void: true,
      is_refund: false,
      void_reason: "Customer request",
      refund_reason: undefined,
      is_synced: true,
      cashier_id: 2,
      customer_id: 2,
      outlet_id: 1,
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:50:00.000000Z",
      deleted_at: undefined,
    },
  ]

  // 🔎 FILTERING (same logic as backend)
  const filtered = allTransactions.filter((t) => {
    const matchSearch =
      t.invoice_number.toLowerCase().includes(search) ||
      (t.payment_reference &&
        t.payment_reference.toLowerCase().includes(search))

    const matchStatus =
      status === "all" ||
      (status === "completed" && t.status === "completed") ||
      (status === "voided" && t.status === "voided") ||
      (status === "refunded" && t.status === "refunded")

    const matchPaymentMethod =
      paymentMethod === "all" || t.payment_method === paymentMethod

    return matchSearch && matchStatus && matchPaymentMethod
  })

  // 📄 PAGINATION
  const perPage = 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)

  const items = filtered.slice((page - 1) * perPage, page * perPage)

  const meta = {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage sales transactions and payment records"
        rightSlot={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        }
      />

      <DataTable columns={transactionColumns} data={items} meta={meta} />
    </div>
  )
}
