"use client"

import { Transaction } from "@/types/transaction"
import { Eye, Pencil, Trash2 } from "lucide-react"

export const transactionColumns = [
  {
    header: "Invoice",
    accessorKey: "invoice_number" as keyof Transaction,
  },
  {
    header: "Date",
    accessorKey: "created_at" as keyof Transaction,
    cell: (row: Transaction) => new Date(row.created_at).toLocaleDateString(),
  },
  {
    header: "Amount",
    accessorKey: "final_amount" as keyof Transaction,
    cell: (row: Transaction) => `Rp ${row.final_amount.toLocaleString()}`,
  },
  {
    header: "Payment Method",
    accessorKey: "payment_method" as keyof Transaction,
    cell: (row: Transaction) => {
      const methodLabels: Record<string, string> = {
        cash: "Cash",
        card: "Card",
        ewallet: "E-Wallet",
        transfer: "Transfer",
      }
      return methodLabels[row.payment_method] || row.payment_method
    },
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
            Completed
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
  {
    header: "Actions",
    accessorKey: "id" as keyof Transaction,
    cell: (row: Transaction) => (
      <div className="flex items-center gap-2">
        {/* View */}
        <button
          onClick={() => console.log("view", row.id)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="View"
        >
          <Eye size={16} />
        </button>

        {/* Edit */}
        {!row.is_void && !row.is_refund && (
          <button
            onClick={() => console.log("edit", row.id)}
            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        )}

        {/* Delete/Void */}
        {!row.is_void && !row.is_refund && (
          <button
            onClick={() => console.log("void", row.id)}
            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
            title="Void"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ),
  },
]
