"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { getOutletColumns } from "./columns"
import { outletService } from "@/lib/api/outlet"
import { Outlet } from "@/types/outlet"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await outletService.getOutlets()
      setOutlets(response.data || [])
    } catch (err) {
      setError("Failed to fetch outlets")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOutlet = (outlet: Outlet) => {
    // This will be implemented when we create the detail page
    console.log("View outlet:", outlet)
  }

  const handleEditOutlet = (outlet: Outlet) => {
    // This will be implemented when we create the edit page
    console.log("Edit outlet:", outlet)
  }

  const handleDeleteOutlet = async (outlet: Outlet) => {
    if (!confirm("Are you sure you want to delete this outlet?")) {
      return
    }

    try {
      await outletService.deleteOutlet(outlet.id)
      await fetchOutlets() // Refresh the list
    } catch (err) {
      console.error("Failed to delete outlet:", err)
      alert("Failed to delete outlet")
    }
  }

  const handleViewStatistics = (outlet: Outlet) => {
    // This will be implemented when we create the statistics page
    console.log("View outlet statistics:", outlet)
  }

  const handleSwitchOutlet = async (outlet: Outlet) => {
    if (!confirm(`Are you sure you want to switch to ${outlet.name}?`)) {
      return
    }

    try {
      await outletService.switchOutlet(outlet.id)
      alert(`Successfully switched to ${outlet.name}`)
      // In a real app, this might refresh the page or update a context
      window.location.reload()
    } catch (err) {
      console.error("Failed to switch outlet:", err)
      alert("Failed to switch outlet")
    }
  }

  const columns = getOutletColumns({
    onView: handleViewOutlet,
    onEdit: handleEditOutlet,
    onDelete: handleDeleteOutlet,
    onStatistics: handleViewStatistics,
    onSwitch: handleSwitchOutlet,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outlets"
        description="Manage and view all outlets"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Link href="/outlets/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Outlet
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="text-red-700">{error}</div>
        </Card>
      )}

      <Card>
        <DataTable
          columns={columns}
          data={outlets}
          meta={{
            page: 1,
            per_page: 10,
            total: outlets.length,
            total_pages: Math.ceil(outlets.length / 10),
          }}
        />
      </Card>
    </div>
  )
}
