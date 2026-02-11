"use client"

import { PaymentMethod } from "@/types/payment-method"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export const paymentMethodColumns = [
  {
    header: "Method Name",
    accessorKey: "name" as keyof PaymentMethod,
  },
  {
    header: "Type",
    accessorKey: "type" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {row.type}
      </span>
    ),
  },
  {
    header: "Fee Type",
    accessorKey: "fee_type" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => (
      <span className="text-sm text-gray-600">{row.fee_type}</span>
    ),
  },
  {
    header: "Fee Value",
    accessorKey: "fee_value" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => {
      if (row.fee_type === "None") {
        return <span className="text-sm text-gray-600">-</span>
      }

      if (row.fee_type === "Fixed Amount") {
        return (
          <span className="text-sm font-medium">
            Rp {row.fee_value.toLocaleString("id-ID")}
          </span>
        )
      }

      return <span className="text-sm font-medium">{row.fee_value}%</span>
    },
  },
  {
    header: "Status",
    accessorKey: "is_active" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => {
      if (row.is_active) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Active
          </span>
        )
      }

      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Inactive
        </span>
      )
    },
  },
  {
    header: "Default",
    accessorKey: "is_default" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => {
      if (row.is_default) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Yes
          </span>
        )
      }

      return <span className="text-sm text-gray-600">No</span>
    },
  },
  {
    header: "Actions",
    accessorKey: "id" as keyof PaymentMethod,
    cell: (row: PaymentMethod) => (
      <div className="flex items-center gap-2">
        {/* Edit */}
        <Link
          href={`/payment-methods/${row.id}/edit`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Edit Payment Method"
        >
          <Edit size={16} />
        </Link>

        {/* Delete */}
        <button
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-700"
          title="Delete Payment Method"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
]
