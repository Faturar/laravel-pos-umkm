"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { ChartCard } from "@/components/dashboard/ChartCard"

export default function ProductReportPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  const productReportStats = {
    totalItemsSold: 2456,
    totalRevenue: 34560000,
    itemsChange: 8.7,
    revenueChange: 12.3,
  }

  type ProductComboData = {
    name: string
    type: string
    quantity: number
    revenue: number
  }

  const allProducts: ProductComboData[] = [
    {
      name: "Nasi Goreng Special",
      type: "Product",
      quantity: 245,
      revenue: 3675000,
    },
    { name: "Ayam Penyet", type: "Product", quantity: 198, revenue: 2970000 },
    {
      name: "Paket Ayam + Nasi + Es Teh",
      type: "Combo",
      quantity: 89,
      revenue: 2225000,
    },
    {
      name: "Paket Sate + Lontong",
      type: "Combo",
      quantity: 76,
      revenue: 1900000,
    },
  ]

  const productColumns = [
    { header: "Name", accessorKey: "name" as keyof ProductComboData },
    { header: "Type", accessorKey: "type" as keyof ProductComboData },
    {
      header: "Quantity Sold",
      accessorKey: "quantity" as keyof ProductComboData,
    },
    {
      header: "Revenue",
      accessorKey: "revenue" as keyof ProductComboData,
      cell: (row: ProductComboData) =>
        `Rp ${row.revenue.toLocaleString("id-ID")}`,
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Product & Combo Report"
            description="Best selling products and combo packages"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex gap-3">
              <DateRangeSelect value={dateRange} onChange={setDateRange} />
              <OutletSelect
                value={selectedOutlet}
                onChange={setSelectedOutlet}
              />
            </div>

            <Button>Export</Button>
          </div>
        </div>

        {/* ================= KPI ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Items Sold"
            value={productReportStats.totalItemsSold.toString()}
            subtitle={`+${productReportStats.itemsChange}%`}
            subtitleColor="success"
          />

          <StatCard
            title="Total Revenue"
            value={`Rp ${productReportStats.totalRevenue.toLocaleString("id-ID")}`}
            subtitle={`+${productReportStats.revenueChange}%`}
            subtitleColor="success"
          />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Top Products"
            description="Best selling individual products"
          >
            <div className="h-72 flex items-center justify-center bg-muted rounded-card">
              <p className="text-sm text-gray-500">Top Products Chart</p>
            </div>
          </ChartCard>

          <ChartCard
            title="Top Combos"
            description="Best selling combo packages"
          >
            <div className="h-72 flex items-center justify-center bg-muted rounded-card">
              <p className="text-sm text-gray-500">Top Combos Chart</p>
            </div>
          </ChartCard>
        </div>

        {/* ================= TABLE ================= */}
        <section className="bg-white border border-border rounded-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Products & Combos</h3>
            <p className="text-sm text-gray-500">
              All products and combos with sales data
            </p>
          </div>

          <DataTable
            columns={productColumns}
            data={allProducts}
            meta={{
              page: 1,
              per_page: 10,
              total: allProducts.length,
              total_pages: 1,
            }}
          />
        </section>
      </div>
    </div>
  )
}
