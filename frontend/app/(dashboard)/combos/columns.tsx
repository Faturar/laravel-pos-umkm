"use client"

import { Combo } from "@/types/combo"
import { Eye, Pencil, Trash2 } from "lucide-react"

export const comboColumns = [
  {
    header: "Combo Name",
    accessorKey: "name" as keyof Combo,
  },
  {
    header: "Price",
    accessorKey: "price" as keyof Combo,
    cell: (row: Combo) => `Rp ${row.price}`,
  },
  {
    header: "Items",
    accessorKey: "items" as keyof Combo,
    cell: (row: Combo) => `${row.items.length} items`,
  },
  {
    header: "Status",
    accessorKey: "is_active" as keyof Combo,
    cell: (row: Combo) =>
      row.is_active ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          Inactive
        </span>
      ),
  },
  {
    header: "Actions",
    accessorKey: "id" as keyof Combo,
    cell: (row: Combo) => (
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
        <button
          onClick={() => console.log("edit", row.id)}
          className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 hover:text-blue-600"
          title="Edit"
        >
          <Pencil size={16} />
        </button>

        {/* Delete */}
        <button
          onClick={() => console.log("delete", row.id)}
          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
]
