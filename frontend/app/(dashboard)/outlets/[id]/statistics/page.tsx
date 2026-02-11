"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { outletService } from "@/lib/api/outlet"
import { Outlet, OutletStatistics } from "@/types/outlet"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react"
import Link from "next/link"
import { SalesChart } from "@/components/dashboard/SalesChart"

export default function OutletStatisticsPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading outlet statistics...</div>
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
        title={`Outlet Statistics: ${outlet.name}`}
        description="View outlet performance and statistics"
        rightSlot={
          <div className="flex gap-2">
            <Link href={`/outlets/${outlet.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Outlet
              </Button>
            </Link>
          </div>
        }
      />

      {statistics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Sales
                    </p>
                    <p className="text-2xl font-bold">
                      Rp {statistics.total_sales.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Transactions
                    </p>
                    <p className="text-2xl font-bold">
                      {statistics.total_transactions}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Customers
                    </p>
                    <p className="text-2xl font-bold">
                      {statistics.total_customers}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Avg. Transaction
                    </p>
                    <p className="text-2xl font-bold">
                      Rp{" "}
                      {statistics.average_transaction.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <div className="h-80">
                  <SalesChart chartView="sales" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                <div className="space-y-4">
                  {statistics.top_products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {product.quantity} sold
                        </p>
                      </div>
                      <p className="font-medium">
                        Rp {product.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500">No product data available</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  {statistics.payment_methods?.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          {method.count} transactions
                        </p>
                      </div>
                      <p className="font-medium">
                        Rp {method.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500">
                      No payment method data available
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Hourly Sales</h3>
                <div className="space-y-4">
                  {statistics.hourly_sales?.map((hour, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{hour.hour}:00</p>
                        <p className="text-sm text-gray-500">
                          {hour.count} transactions
                        </p>
                      </div>
                      <p className="font-medium">
                        Rp {hour.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500">
                      No hourly sales data available
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {!statistics && (
        <Card>
          <div className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Statistics Available
            </h3>
            <p className="text-gray-500">
              There is no statistical data available for this outlet yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
