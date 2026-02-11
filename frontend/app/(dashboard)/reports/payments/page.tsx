"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { ChartCard } from "@/components/dashboard/ChartCard"

export default function PaymentReportPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  const paymentReportStats = {
    totalTransactions: 892,
    totalFees: 268500,
    transactionsChange: 12.8,
    feesChange: 8.5,
  }

  type PaymentData = {
    method: string
    transactions: number
    totalAmount: number
    fees: number
  }

  const paymentTableData: PaymentData[] = [
    { method: "Cash", transactions: 444, totalAmount: 6200000, fees: 0 },
    { method: "QRIS", transactions: 283, totalAmount: 3950000, fees: 118500 },
    {
      method: "E-Wallet",
      transactions: 129,
      totalAmount: 1800000,
      fees: 90000,
    },
    { method: "Card", transactions: 36, totalAmount: 500000, fees: 60000 },
  ]

  const paymentColumns = [
    { header: "Payment Method", accessorKey: "method" as keyof PaymentData },
    {
      header: "Transactions",
      accessorKey: "transactions" as keyof PaymentData,
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount" as keyof PaymentData,
      cell: (row: PaymentData) =>
        `Rp ${row.totalAmount.toLocaleString("id-ID")}`,
    },
    {
      header: "Fees",
      accessorKey: "fees" as keyof PaymentData,
      cell: (row: PaymentData) => `Rp ${row.fees.toLocaleString("id-ID")}`,
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Payment Method Report"
            description="Payment breakdown and trends"
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
            title="Total Transactions"
            value={paymentReportStats.totalTransactions.toString()}
            subtitle={`+${paymentReportStats.transactionsChange}%`}
            subtitleColor="success"
          />

          <StatCard
            title="Total Fees"
            value={`Rp ${paymentReportStats.totalFees.toLocaleString("id-ID")}`}
            subtitle={`+${paymentReportStats.feesChange}%`}
            subtitleColor="success"
          />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Payment Method Breakdown"
            description="Distribution of payment methods"
          >
            <div className="h-72 flex items-center justify-center bg-muted rounded-card">
              <p className="text-sm text-gray-500">Payment Method Pie Chart</p>
            </div>
          </ChartCard>

          <ChartCard
            title="Payment Trend Over Time"
            description="Daily payment usage"
          >
            <div className="h-72 flex items-center justify-center bg-muted rounded-card">
              <p className="text-sm text-gray-500">Payment Trend Line Chart</p>
            </div>
          </ChartCard>
        </div>

        {/* ================= TABLE ================= */}
        <section className="bg-white border border-border rounded-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Payment Methods</h3>
            <p className="text-sm text-gray-500">
              Detailed payment method statistics
            </p>
          </div>

          <DataTable
            columns={paymentColumns}
            data={paymentTableData}
            meta={{
              page: 1,
              per_page: 10,
              total: paymentTableData.length,
              total_pages: 1,
            }}
          />
        </section>
      </div>
    </div>
  )
}
