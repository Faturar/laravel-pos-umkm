"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { salesReportTransactionColumns } from "./columns"
import { Transaction } from "@/types/transaction"

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [chartView, setChartView] = useState("sales")

  // Sales report stats data
  const salesReportStats = {
    totalSales: 12450000,
    totalTransactions: 892,
    averageOrderValue: 13957,
    netRevenue: 12100000,
    salesChange: 15.2,
    transactionsChange: 12.8,
    aovChange: 2.1,
    revenueChange: 14.5,
  }

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 1,
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      invoice_number: "INV-20240201-0001",
      subtotal: 45000,
      discount_amount: 0,
      tax_amount: 4500,
      service_charge_amount: 0,
      total_amount: 49500,
      final_amount: 49500,
      paid_amount: 50000,
      change_amount: 500,
      payment_method: "Cash",
      payment_reference: "",
      notes: "",
      status: "completed",
      is_void: false,
      is_refund: false,
      void_reason: "",
      refund_reason: "",
      is_synced: true,
      cashier_id: 1,
      customer_id: 1,
      outlet_id: 1,
      created_at: "2024-02-01T08:30:00.000000Z",
      updated_at: "2024-02-01T08:30:00.000000Z",
    },
    {
      id: 2,
      uuid: "550e8400-e29b-41d4-a716-446655440001",
      invoice_number: "INV-20240201-0002",
      subtotal: 75000,
      discount_amount: 7500,
      tax_amount: 6750,
      service_charge_amount: 0,
      total_amount: 74250,
      final_amount: 74250,
      paid_amount: 74250,
      change_amount: 0,
      payment_method: "QRIS",
      payment_reference: "QR123456789",
      notes: "",
      status: "completed",
      is_void: false,
      is_refund: false,
      void_reason: "",
      refund_reason: "",
      is_synced: true,
      cashier_id: 1,
      customer_id: undefined,
      outlet_id: 1,
      created_at: "2024-02-01T09:15:00.000000Z",
      updated_at: "2024-02-01T09:15:00.000000Z",
    },
    {
      id: 3,
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      invoice_number: "INV-20240201-0003",
      subtotal: 120000,
      discount_amount: 0,
      tax_amount: 12000,
      service_charge_amount: 5000,
      total_amount: 137000,
      final_amount: 137000,
      paid_amount: 137000,
      change_amount: 0,
      payment_method: "E-Wallet",
      payment_reference: "EW987654321",
      notes: "",
      status: "completed",
      is_void: false,
      is_refund: false,
      void_reason: "",
      refund_reason: "",
      is_synced: true,
      cashier_id: 2,
      customer_id: 2,
      outlet_id: 1,
      created_at: "2024-02-01T10:45:00.000000Z",
      updated_at: "2024-02-01T10:45:00.000000Z",
    },
  ]

  // Payment method breakdown data
  const paymentMethodBreakdown = [
    { name: "Cash", amount: 6200000, percentage: 49.8, transactions: 444 },
    { name: "QRIS", amount: 3950000, percentage: 31.7, transactions: 283 },
    { name: "E-Wallet", amount: 1800000, percentage: 14.5, transactions: 129 },
    { name: "Card", amount: 500000, percentage: 4.0, transactions: 36 },
  ]

  // Best selling products data
  const bestSellingProducts = [
    { name: "Nasi Goreng Special", quantity: 245, revenue: 3675000 },
    { name: "Ayam Penyet", quantity: 198, revenue: 2970000 },
    { name: "Sate Ayam", quantity: 156, revenue: 2340000 },
    { name: "Mie Goreng", quantity: 142, revenue: 2130000 },
    { name: "Bakso", quantity: 128, revenue: 1920000 },
    { name: "Gado-Gado", quantity: 98, revenue: 1470000 },
    { name: "Soto Ayam", quantity: 85, revenue: 1275000 },
    { name: "Rendang", quantity: 72, revenue: 1080000 },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <PageHeader
          title="Sales Report"
          description="Sales Performance Overview"
          rightSlot={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <DateRangeSelect value={dateRange} onChange={setDateRange} />
                <OutletSelect
                  value={selectedOutlet}
                  onChange={setSelectedOutlet}
                />
              </div>

              <Button className="bg-primary hover:bg-primary-hover text-white rounded-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </Button>
            </div>
          }
        />
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={`Rp ${salesReportStats.totalSales.toLocaleString("id-ID")}`}
          subtitle={`${salesReportStats.salesChange > 0 ? "+" : ""}${salesReportStats.salesChange}%`}
          subtitleColor={salesReportStats.salesChange > 0 ? "success" : "error"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Transactions"
          value={salesReportStats.totalTransactions.toString()}
          subtitle={`${salesReportStats.transactionsChange > 0 ? "+" : ""}${salesReportStats.transactionsChange}%`}
          subtitleColor={
            salesReportStats.transactionsChange > 0 ? "success" : "error"
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        <StatCard
          title="Average Order Value"
          value={`Rp ${salesReportStats.averageOrderValue.toLocaleString("id-ID")}`}
          subtitle={`${salesReportStats.aovChange > 0 ? "+" : ""}${salesReportStats.aovChange}%`}
          subtitleColor={salesReportStats.aovChange > 0 ? "success" : "error"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />

        <StatCard
          title="Net Revenue"
          value={`Rp ${salesReportStats.netRevenue.toLocaleString("id-ID")}`}
          subtitle={`${salesReportStats.revenueChange > 0 ? "+" : ""}${salesReportStats.revenueChange}%`}
          subtitleColor={
            salesReportStats.revenueChange > 0 ? "success" : "error"
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Main Sales Chart */}
      <div className="mb-8">
        <ChartCard title="Sales Performance" description="Daily sales trends">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setChartView("sales")}
              className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors ${
                chartView === "sales"
                  ? "bg-primary text-white"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setChartView("transactions")}
              className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors ${
                chartView === "transactions"
                  ? "bg-primary text-white"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setChartView("revenue")}
              className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors ${
                chartView === "revenue"
                  ? "bg-primary text-white"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Revenue
            </button>
          </div>

          <div className="h-80 flex items-center justify-center bg-background rounded-card border border-border">
            <div className="text-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Sales Performance Chart
              </p>
              <p className="text-xs text-gray-400">
                Displaying {chartView} data
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Payment Method Breakdown */}
        <section className="bg-white rounded-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Payment Method Breakdown
            </h3>
            <p className="text-sm text-muted-foreground">
              Distribution of payment methods
            </p>
          </div>

          <div className="space-y-4">
            {paymentMethodBreakdown.map((method) => (
              <div key={method.name}>
                {/* Header */}
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">
                    {method.name}
                  </span>
                  <span className="text-muted-foreground">
                    {method.percentage}%
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>

                {/* Meta */}
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{method.transactions} transactions</span>
                  <span>Rp {method.amount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Selling Products & Combos */}
        <section className="bg-white rounded-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Best Selling Products & Combos
            </h3>
            <p className="text-sm text-muted-foreground">
              Top performing items
            </p>
          </div>

          <div className="space-y-3">
            {bestSellingProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.quantity} sold
                    </p>
                  </div>
                </div>

                {/* Revenue */}
                <p className="font-medium text-sm text-foreground">
                  Rp {product.revenue.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detailed Transactions */}
      <section className="mt-10 bg-white p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Transactions
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed transaction records
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-bakground rounded-card border border-border">
          <DataTable
            columns={salesReportTransactionColumns}
            data={transactions}
            meta={{
              page: 1,
              per_page: 10,
              total: transactions.length,
              total_pages: 1,
            }}
          />
        </div>
      </section>
    </div>
  )
}
