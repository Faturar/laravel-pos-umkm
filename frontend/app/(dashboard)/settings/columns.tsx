"use client"

import { Setting } from "@/types/setting"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"

export const settingColumns = [
  {
    header: "ID",
    accessorKey: "id" as keyof Setting,
  },
  {
    header: "Key",
    accessorKey: "key" as keyof Setting,
  },
  {
    header: "Value",
    accessorKey: "value" as keyof Setting,
    cell: (row: Setting) => {
      const value = row.value
      // Truncate long values
      return value.length > 50 ? `${value.substring(0, 50)}...` : value
    },
  },
  {
    header: "Description",
    accessorKey: "description" as keyof Setting,
    cell: (row: Setting) => {
      const description = row.description
      return (
        description || <span className="text-gray-400">No description</span>
      )
    },
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at" as keyof Setting,
    cell: (row: Setting) => {
      const updatedAt = row.updated_at
      return updatedAt ? new Date(updatedAt).toLocaleDateString() : "Never"
    },
  },
  {
    header: "Actions",
    accessorKey: "id" as keyof Setting,
    cell: (row: Setting) => (
      <div className="flex items-center gap-2">
        {/* View */}
        <Link
          href={`/settings/${row.id}/detail`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
        {/* Edit */}
        <Link
          href={`/settings/${row.id}/edit`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Edit Setting"
        >
          <Edit size={16} />
        </Link>
      </div>
    ),
  },
]
