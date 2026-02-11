"use client"

import { Outlet } from "@/types/outlet"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"

interface OutletColumnsProps {
  onView?: (outlet: Outlet) => void
  onEdit?: (outlet: Outlet) => void
  onDelete?: (outlet: Outlet) => void
  onStatistics?: (outlet: Outlet) => void
  onSwitch?: (outlet: Outlet) => void
}

export function getOutletColumns({
  onView,
  onEdit,
  onDelete,
  onStatistics,
  onSwitch,
}: OutletColumnsProps = {}) {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: (outlet: Outlet) => (
        <div className="font-medium">{outlet.code}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (outlet: Outlet) => (
        <div className="font-medium">{outlet.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (outlet: Outlet) => <div>{outlet.phone || "-"}</div>,
    },
    {
      accessorKey: "tax_rate",
      header: "Tax Rate",
      cell: (outlet: Outlet) => <div>{outlet.tax_rate}%</div>,
    },
    {
      accessorKey: "service_charge_rate",
      header: "Service Charge",
      cell: (outlet: Outlet) => <div>{outlet.service_charge_rate}%</div>,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: (outlet: Outlet) => (
        <Badge variant={outlet.is_active ? "default" : "secondary"}>
          {outlet.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (outlet: Outlet) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(outlet)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(outlet)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onStatistics && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatistics(outlet)}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}

          {onSwitch && outlet.is_active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSwitch(outlet)}
              title="Switch to this outlet"
            >
              Switch
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(outlet)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/outlets/${outlet.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
