"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { outletService } from "@/lib/api/outlet"
import { Outlet, OutletStatistics } from "@/types/outlet"
import { ArrowLeft, Edit, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function OutletDetailPage() {
  const params = useParams()
  const outletId = params.id as string
  const [outlet, setOutlet] = useState<Outlet | null>(null)
  const [statistics, setStatistics] = useState<OutletStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (outletId) {
      fetchOutlet()
      fetchOutletStatistics()
    }
  }, [outletId])

  const fetchOutlet = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await outletService.getOutlet(parseInt(outletId))
      setOutlet(response.data)
    } catch (err) {
      setError("Failed to fetch outlet")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutletStatistics = async () => {
    try {
      const response = await outletService.getOutletStatistics(
        parseInt(outletId),
      )
      setStatistics(response.data)
    } catch (err) {
      console.error("Failed to fetch outlet statistics:", err)
    }
  }

  const handleDeleteOutlet = async () => {
    if (!outlet || !confirm("Are you sure you want to delete this outlet?")) {
      return
    }

    try {
      await outletService.deleteOutlet(outlet.id)
      // Redirect to outlets list after successful deletion
      window.location.href = "/outlets"
    } catch (err) {
      console.error("Failed to delete outlet:", err)
      alert("Failed to delete outlet")
    }
  }

  const handleSwitchOutlet = async () => {
    if (
      !outlet ||
      !confirm(`Are you sure you want to switch to ${outlet.name}?`)
    ) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading outlet details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!outlet) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Outlet not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Outlet: ${outlet.name}`}
        description="View outlet details"
        rightSlot={
          <div className="flex gap-2">
            <Link href={`/outlets/${outlet.id}/statistics`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistics
              </Button>
            </Link>
            <Link href={`/outlets/${outlet.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            {outlet.is_active && (
              <Button variant="outline" size="sm" onClick={handleSwitchOutlet}>
                Switch to This Outlet
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDeleteOutlet}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Link href="/outlets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Outlets
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Outlet Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Code:</span>
                <span className="font-medium">{outlet.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{outlet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span>{outlet.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span>{outlet.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={outlet.is_active ? "default" : "secondary"}>
                  {outlet.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(outlet.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Tax & Service Charges
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Tax Rate:</span>
                <span className="font-medium">{outlet.tax_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Charge Rate:</span>
                <span className="font-medium">
                  {outlet.service_charge_rate}%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  These rates will be applied to transactions at this outlet.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {outlet.address && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-600">{outlet.address}</p>
          </div>
        </Card>
      )}

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
              <p className="text-3xl font-bold">
                {statistics.total_transactions}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold">
                Rp {statistics.total_sales.toLocaleString("id-ID")}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Average Transaction
              </h3>
              <p className="text-3xl font-bold">
                Rp {statistics.average_transaction.toLocaleString("id-ID")}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
