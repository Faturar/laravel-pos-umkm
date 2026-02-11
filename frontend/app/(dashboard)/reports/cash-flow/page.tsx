"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"

export default function CashFlowReportPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  const cashFlowStats = {
    cashIn: 15200000,
    cashOut: 3100000,
    netCash: 12100000,
    cashInChange: 10.2,
    cashOutChange: 5.8,
    netCashChange: 12.5,
  }

  const cashFlowTableData = [
    {
      date: "2024-01-07",
      type: "In",
      amount: 2150000,
      description: "Daily sales",
    },
    {
      date: "2024-01-07",
      type: "Out",
      amount: 620000,
      description: "Supplier payment",
    },
    {
      date: "2024-01-06",
      type: "In",
      amount: 2300000,
      description: "Daily sales",
    },
    {
      date: "2024-01-06",
      type: "Out",
      amount: 480000,
      description: "Utilities",
    },
  ]

  type CashFlowData = (typeof cashFlowTableData)[number]

  const cashFlowColumns = [
    { header: "Date", accessorKey: "date" as keyof CashFlowData },
    {
      header: "Type",
      accessorKey: "type" as keyof CashFlowData,
      cell: (row: CashFlowData) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.type === "In"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof CashFlowData,
      cell: (row: CashFlowData) => `Rp ${row.amount.toLocaleString("id-ID")}`,
    },
    { header: "Description", accessorKey: "description" as keyof CashFlowData },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Cash Flow Report"
            description="Cash in, cash out, and net cash"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Cash In"
            value={`Rp ${cashFlowStats.cashIn.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.cashInChange}%`}
            subtitleColor="success"
          />

          <StatCard
            title="Cash Out"
            value={`Rp ${cashFlowStats.cashOut.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.cashOutChange}%`}
            subtitleColor="error"
          />

          <StatCard
            title="Net Cash"
            value={`Rp ${cashFlowStats.netCash.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.netCashChange}%`}
            subtitleColor="success"
          />
        </div>

        {/* ================= CHART ================= */}
        <section className="bg-white border border-border rounded-card p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Cash In vs Cash Out
          </h3>

          <div className="h-80 flex items-center justify-center bg-muted rounded-card">
            <p className="text-gray-500 text-sm">Cash Flow Chart Placeholder</p>
          </div>
        </section>

        {/* ================= TABLE ================= */}
        <section className="bg-white border border-border rounded-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Cash Flow Details</h3>
            <p className="text-sm text-gray-500">
              Detailed cash in and out records
            </p>
          </div>

          <DataTable
            columns={cashFlowColumns}
            data={cashFlowTableData}
            meta={{
              page: 1,
              per_page: 10,
              total: cashFlowTableData.length,
              total_pages: 1,
            }}
          />
        </section>
      </div>
    </div>
  )
}
