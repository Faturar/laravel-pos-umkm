"use client"

import { Product } from "@/types/product"
import { Eye } from "lucide-react"
import Link from "next/link"

export const inventoryColumns = [
  {
    header: "Product",
    accessorKey: "name" as keyof Product,
  },
  {
    header: "SKU",
    accessorKey: "sku" as keyof Product,
  },
  {
    header: "Category",
    accessorKey: "category" as keyof Product,
    cell: (row: Product) => row.category?.name || "-",
  },
  {
    header: "Current Stock",
    accessorKey: "stock_quantity" as keyof Product,
    cell: (row: Product) => {
      const isLowStock = row.stock_quantity <= row.stock_alert_threshold
      const isOutOfStock = row.stock_quantity === 0

      return (
        <span
          className={`font-medium ${isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : "text-green-600"}`}
        >
          {row.stock_quantity}
        </span>
      )
    },
  },
  {
    header: "Alert Threshold",
    accessorKey: "stock_alert_threshold" as keyof Product,
    cell: (row: Product) => row.stock_alert_threshold,
  },
  {
    header: "Stock Status",
    accessorKey: "stock_quantity" as keyof Product,
    cell: (row: Product) => {
      const isLowStock = row.stock_quantity <= row.stock_alert_threshold
      const isOutOfStock = row.stock_quantity === 0

      if (isOutOfStock) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Out of Stock
          </span>
        )
      }

      if (isLowStock) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Low Stock
          </span>
        )
      }

      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          In Stock
        </span>
      )
    },
  },
  {
    header: "Stock Value",
    accessorKey: "stock_quantity" as keyof Product,
    cell: (row: Product) =>
      `Rp ${(row.stock_quantity * row.cost).toLocaleString("id-ID")}`,
  },
  {
    header: "Actions",
    accessorKey: "id" as keyof Product,
    cell: (row: Product) => (
      <div className="flex items-center gap-2">
        {/* View */}
        <Link
          href={`/inventory/${row.id}/detail`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
      </div>
    ),
  },
]
