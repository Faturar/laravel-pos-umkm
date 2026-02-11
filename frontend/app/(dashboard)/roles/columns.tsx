"use client"

import { Role } from "@/types/user"
import { Badge } from "@/components/ui/Badge"
import { Eye, Edit, Shield } from "lucide-react"
import Link from "next/link"

export const roleColumns = [
  {
    header: "ID",
    accessorKey: "id" as keyof Role,
  },
  {
    header: "Name",
    accessorKey: "name" as keyof Role,
  },
  {
    header: "Description",
    accessorKey: "description" as keyof Role,
    cell: (row: Role) => {
      const description = row.description
      return (
        description || <span className="text-gray-400">No description</span>
      )
    },
  },
  {
    header: "Status",
    accessorKey: "is_active" as keyof Role,
    cell: (row: Role) => {
      const isActive = row.is_active
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    header: "Created",
    accessorKey: "created_at" as keyof Role,
    cell: (row: Role) => {
      const date = new Date(row.created_at)
      return date.toLocaleDateString()
    },
  },
  {
    header: "Actions",
    accessorKey: "id" as keyof Role,
    cell: (row: Role) => (
      <div className="flex items-center gap-2">
        {/* View */}
        <Link
          href={`/roles/${row.id}/detail`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
        {/* Edit */}
        <Link
          href={`/roles/${row.id}/edit`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Edit Role"
        >
          <Edit size={16} />
        </Link>
        {/* Permissions */}
        <Link
          href={`/roles/${row.id}/permissions`}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Manage Permissions"
        >
          <Shield size={16} />
        </Link>
      </div>
    ),
  },
]
