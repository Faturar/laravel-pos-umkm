"use client"

import { PaymentMethod } from "@/types/payment-method"
import { DataTable } from "./DataTable"

interface PaymentMethodDataTableProps {
  columns: {
    header: string
    accessorKey: keyof PaymentMethod
    cell?: (row: PaymentMethod) => React.ReactNode
  }[]
  data: PaymentMethod[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  types: string[]
}

export function PaymentMethodDataTable({
  columns,
  data,
  meta,
  types,
}: PaymentMethodDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      meta={meta}
      customFilters={
        <div className="space-x-4">
          <select
            title="type"
            defaultValue="all"
            className="px-4 py-2 border border-border rounded-button"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      }
    />
  )
}
