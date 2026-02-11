"use client"

import { Customer } from "@/types/customer"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface CustomerColumnsProps {
  onView?: (customer: Customer) => void
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
}

export function getCustomerColumns({
  onView,
  onEdit,
  onDelete,
}: CustomerColumnsProps = {}) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (customer: Customer) => (
        <div className="font-medium">{customer.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (customer: Customer) => <div>{customer.email || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (customer: Customer) => <div>{customer.phone || "-"}</div>,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: (customer: Customer) => (
        <div
          className={`font-medium ${customer.balance < 0 ? "text-red-500" : ""}`}
        >
          Rp {customer.balance.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: (customer: Customer) => (
        <Badge variant={customer.is_active ? "default" : "secondary"}>
          {customer.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (customer: Customer) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(customer)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(customer)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/customers/${customer.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
