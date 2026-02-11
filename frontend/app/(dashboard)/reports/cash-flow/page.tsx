"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import CashFlowLineChart from "@/components/dashboard/CashFlowLineChart"
import CashFlowPieChart from "@/components/dashboard/CashFlowPieChart"
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react"

export default function CashFlowReportPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [selectedOutlet, setSelectedOutlet] = useState("all")

  const cashFlowStats = {
    cashIn: 15200000,
    cashOut: 3100000,
    netCash: 12100000,
    cashBalance: 8500000,
    cashInChange: 10.2,
    cashOutChange: 5.8,
    netCashChange: 12.5,
  }

  const cashFlowTableData = [
    {
      date: "2024-01-07",
      type: "In",
      category: "Sales",
      description: "Daily sales",
      reference: "TRX-001",
      amount: 2150000,
      createdBy: "John Doe",
    },
    {
      date: "2024-01-07",
      type: "Out",
      category: "Expense",
      description: "Supplier payment",
      reference: "EXP-001",
      amount: 620000,
      createdBy: "Jane Smith",
    },
    {
      date: "2024-01-06",
      type: "In",
      category: "Sales",
      description: "Daily sales",
      reference: "TRX-002",
      amount: 2300000,
      createdBy: "John Doe",
    },
    {
      date: "2024-01-06",
      type: "Out",
      category: "Expense",
      description: "Utilities",
      reference: "EXP-002",
      amount: 480000,
      createdBy: "Jane Smith",
    },
    {
      date: "2024-01-05",
      type: "In",
      category: "Transfer",
      description: "Bank transfer",
      reference: "TRX-003",
      amount: 1500000,
      createdBy: "John Doe",
    },
    {
      date: "2024-01-05",
      type: "Out",
      category: "Refund",
      description: "Customer refund",
      reference: "REF-001",
      amount: 350000,
      createdBy: "Jane Smith",
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
    { header: "Category", accessorKey: "category" as keyof CashFlowData },
    { header: "Description", accessorKey: "description" as keyof CashFlowData },
    { header: "Reference", accessorKey: "reference" as keyof CashFlowData },
    {
      header: "Amount",
      accessorKey: "amount" as keyof CashFlowData,
      cell: (row: CashFlowData) => (
        <span
          className={`font-medium ${
            row.type === "In" ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.type === "In" ? "+" : "-"}Rp {row.amount.toLocaleString("id-ID")}
        </span>
      ),
    },
    { header: "Created By", accessorKey: "createdBy" as keyof CashFlowData },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Cash Flow Report"
            description="Monitor cash movement and financial balance"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex gap-3">
              <DateRangeSelect value={dateRange} onChange={setDateRange} />
              <OutletSelect
                value={selectedOutlet}
                onChange={setSelectedOutlet}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline">PDF</Button>
              <Button variant="outline">Excel</Button>
            </div>
          </div>
        </div>

        {/* ================= KPI SUMMARY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Cash In"
            value={`Rp ${cashFlowStats.cashIn.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.cashInChange}% vs last period`}
            subtitleColor="success"
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            iconBg="bg-green-100"
          />

          <StatCard
            title="Total Cash Out"
            value={`Rp ${cashFlowStats.cashOut.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.cashOutChange}% vs last period`}
            subtitleColor="error"
            icon={<TrendingDown className="w-8 h-8 text-red-600" />}
            iconBg="bg-red-100"
          />

          <StatCard
            title="Net Cash"
            value={`Rp ${cashFlowStats.netCash.toLocaleString("id-ID")}`}
            subtitle={`+${cashFlowStats.netCashChange}% vs last period`}
            subtitleColor={cashFlowStats.netCash >= 0 ? "success" : "error"}
            icon={
              cashFlowStats.netCash >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )
            }
            iconBg={cashFlowStats.netCash >= 0 ? "bg-green-100" : "bg-red-100"}
          />

          <StatCard
            title="Current Cash Balance"
            value={`Rp ${cashFlowStats.cashBalance.toLocaleString("id-ID")}`}
            subtitle="Available balance"
            subtitleColor="info"
            icon={<DollarSign className="w-8 h-8 text-blue-600" />}
            iconBg="bg-blue-100"
          />
        </div>

        {/* ================= MAIN CHART ================= */}
        <section className="bg-white border border-border rounded-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Cash Flow Trend</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Daily
              </Button>
              <Button variant="outline" size="sm">
                Weekly
              </Button>
              <Button variant="primary" size="sm">
                Monthly
              </Button>
            </div>
          </div>

          <div className="h-80">
            <CashFlowLineChart />
          </div>
        </section>

        {/* ================= BREAKDOWN SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Out Breakdown */}
          <section className="bg-white border border-border rounded-card p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Cash Out Breakdown
            </h3>
            <CashFlowPieChart
              title=""
              labels={[
                "Expenses",
                "Refunds",
                "Supplier Payments",
                "Operational Costs",
              ]}
              data={[1200000, 800000, 600000, 500000]}
              backgroundColors={["#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"]}
            />
          </section>

          {/* Cash In Breakdown */}
          <section className="bg-white border border-border rounded-card p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Cash In Breakdown
            </h3>
            <CashFlowPieChart
              title=""
              labels={[
                "Sales (Cash)",
                "Sales (Transfer)",
                "Other Income",
                "Manual Input",
              ]}
              data={[8000000, 5000000, 1500000, 700000]}
              backgroundColors={["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"]}
            />
          </section>
        </div>

        {/* ================= DETAILED TABLE ================= */}
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
