"use client"

import { Transaction } from "@/types/transaction"

export const salesReportTransactionColumns = [
  {
    header: "Date",
    accessorKey: "created_at" as keyof Transaction,
    cell: (row: Transaction) =>
      new Date(row.created_at).toLocaleDateString("id-ID"),
  },
  {
    header: "Transaction ID",
    accessorKey: "invoice_number" as keyof Transaction,
  },
  {
    header: "Payment Method",
    accessorKey: "payment_method" as keyof Transaction,
    cell: (row: Transaction) => {
      const methodLabels: Record<string, string> = {
        cash: "Cash",
        card: "Card",
        qris: "QRIS",
        ewallet: "E-Wallet",
        transfer: "Transfer",
      }
      return methodLabels[row.payment_method] || row.payment_method
    },
  },
  {
    header: "Total",
    accessorKey: "final_amount" as keyof Transaction,
    cell: (row: Transaction) =>
      `Rp ${row.final_amount.toLocaleString("id-ID")}`,
  },
  {
    header: "Status",
    accessorKey: "status" as keyof Transaction,
    cell: (row: Transaction) => {
      if (row.is_void) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Voided
          </span>
        )
      }
      if (row.is_refund) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Refunded
          </span>
        )
      }
      if (row.status === "completed") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Paid
          </span>
        )
      }
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          {row.status}
        </span>
      )
    },
  },
]
