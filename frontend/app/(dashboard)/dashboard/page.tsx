import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Clock,
  User,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"

// Dashboard stats interface
interface DashboardStats {
  totalSales: number
  totalTransactions: number
  averageOrderValue: number
  netRevenue: number
  cashBalance?: number
  salesChange: number
  transactionsChange: number
  aovChange: number
  revenueChange: number
}

// Payment method breakdown interface
interface PaymentMethodBreakdown {
  method: string
  count: number
  total: number
  percentage: number
}

// Best selling item interface
interface BestSellingItem {
  id: number
  name: string
  type: "product" | "combo"
  quantity: number
  revenue: number
}

// Recent transaction interface
interface RecentTransaction {
  id: number
  invoice_number: string
  customer_name?: string
  created_at: string
  final_amount: number
  status: string
  is_void: boolean
  is_refund: boolean
}

// Dashboard stats data
const dashboardStats: DashboardStats = {
  totalSales: 2450000,
  totalTransactions: 186,
  averageOrderValue: 13172,
  netRevenue: 2380000,
  cashBalance: 1500000,
  salesChange: 12.4,
  transactionsChange: 8.2,
  aovChange: 3.8,
  revenueChange: 10.5,
}

// Payment method breakdown data
const paymentMethods: PaymentMethodBreakdown[] = [
  { method: "Cash", count: 95, total: 1250000, percentage: 51.0 },
  { method: "QRIS", count: 62, total: 820000, percentage: 33.5 },
  { method: "E-Wallet", count: 21, total: 280000, percentage: 11.4 },
  { method: "Card", count: 8, total: 100000, percentage: 4.1 },
]

// Best selling items data
const bestSellingItems: BestSellingItem[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    type: "product",
    quantity: 45,
    revenue: 900000,
  },
  {
    id: 2,
    name: "Ayam Penyet + Es Teh",
    type: "combo",
    quantity: 32,
    revenue: 640000,
  },
  {
    id: 3,
    name: "Mie Ayam Bakso",
    type: "product",
    quantity: 28,
    revenue: 560000,
  },
  {
    id: 4,
    name: "Sate Ayam Madura",
    type: "product",
    quantity: 24,
    revenue: 480000,
  },
  {
    id: 5,
    name: "Bakso Urat + Es Jeruk",
    type: "combo",
    quantity: 22,
    revenue: 440000,
  },
]

// Recent transactions data
const recentTransactions: RecentTransaction[] = [
  {
    id: 1,
    invoice_number: "INV-10231",
    customer_name: "John Doe",
    created_at: "2024-02-05T10:30:00.000000Z",
    final_amount: 245000,
    status: "completed",
    is_void: false,
    is_refund: false,
  },
  {
    id: 2,
    invoice_number: "INV-10232",
    customer_name: "Sarah Wijaya",
    created_at: "2024-02-05T11:15:00.000000Z",
    final_amount: 120000,
    status: "completed",
    is_void: false,
    is_refund: false,
  },
  {
    id: 3,
    invoice_number: "INV-10233",
    customer_name: "Budi Santoso",
    created_at: "2024-02-05T12:45:00.000000Z",
    final_amount: 87500,
    status: "completed",
    is_void: false,
    is_refund: false,
  },
  {
    id: 4,
    invoice_number: "INV-10234",
    customer_name: "Rina Wijaya",
    created_at: "2024-02-05T13:20:00.000000Z",
    final_amount: 320000,
    status: "completed",
    is_void: false,
    is_refund: false,
  },
  {
    id: 5,
    invoice_number: "INV-10235",
    customer_name: "Ahmad Fauzi",
    created_at: "2024-02-05T14:10:00.000000Z",
    final_amount: 156000,
    status: "void",
    is_void: true,
    is_refund: false,
  },
]

// Low stock alerts
const lowStockAlerts = [
  { id: 1, name: "Teh Botol", stock: 3, minStock: 10 },
  { id: 2, name: "Ayam Fillet", stock: 5, minStock: 15 },
  { id: 3, name: "Saus Sambal", stock: 2, minStock: 8 },
]

export default function DashboardPage() {
  // Format stats for display
  const formattedStats = {
    totalSales: `Rp ${dashboardStats.totalSales.toLocaleString("id-ID")}`,
    totalTransactions: dashboardStats.totalTransactions.toString(),
    averageOrderValue: `Rp ${dashboardStats.averageOrderValue.toLocaleString("id-ID")}`,
    netRevenue: `Rp ${dashboardStats.netRevenue.toLocaleString("id-ID")}`,
    salesChange: `${dashboardStats.salesChange > 0 ? "+" : ""}${dashboardStats.salesChange}%`,
    transactionsChange: `${dashboardStats.transactionsChange > 0 ? "+" : ""}${dashboardStats.transactionsChange}%`,
    aovChange: `${dashboardStats.aovChange > 0 ? "+" : ""}${dashboardStats.aovChange}%`,
    revenueChange: `${dashboardStats.revenueChange > 0 ? "+" : ""}${dashboardStats.revenueChange}%`,
  }

  // Determine subtitle colors based on change values
  const salesSubtitleColor =
    dashboardStats.salesChange >= 0 ? "success" : "error"
  const transactionsSubtitleColor =
    dashboardStats.transactionsChange >= 0 ? "success" : "error"
  const aovSubtitleColor = dashboardStats.aovChange >= 0 ? "success" : "error"
  const revenueSubtitleColor =
    dashboardStats.revenueChange >= 0 ? "success" : "error"

  return (
    <div className="space-y-6">
      {/* ================= TOP BAR ================= */}
      <PageHeader
        title="Dashboard"
        description="Business performance overview"
        rightSlot={
          <div className="flex gap-2">
            <DateRangeSelect />
            <OutletSelect />
          </div>
        }
      />

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formattedStats.totalSales}
          subtitle={`${formattedStats.salesChange} vs yesterday`}
          subtitleColor={salesSubtitleColor}
          icon={<DollarSign className="w-7 h-7 text-foreground" />}
          iconBg="bg-blue-100"
        />

        <StatCard
          title="Total Transactions"
          value={formattedStats.totalTransactions}
          subtitle={`${formattedStats.transactionsChange} vs yesterday`}
          subtitleColor={transactionsSubtitleColor}
          icon={<ShoppingCart className="w-7 h-7 text-foreground" />}
          iconBg="bg-green-100"
        />

        <StatCard
          title="Average Order Value"
          value={formattedStats.averageOrderValue}
          subtitle={`${formattedStats.aovChange} vs yesterday`}
          subtitleColor={aovSubtitleColor}
          icon={<TrendingUp className="w-7 h-7 text-foreground" />}
          iconBg="bg-yellow-100"
        />

        <StatCard
          title="Net Revenue"
          value={formattedStats.netRevenue}
          subtitle={`${formattedStats.revenueChange} vs yesterday`}
          subtitleColor={revenueSubtitleColor}
          icon={<CreditCard className="w-7 h-7 text-foreground" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* ================= MAIN SALES CHART ================= */}
      <ChartCard title="Sales Trend (Last 7 Days)">
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="mb-2">Sales trend chart will be displayed here</p>
            <p className="text-sm">
              Toggle between Sales / Transactions / Revenue
            </p>
          </div>
        </div>
      </ChartCard>

      {/* ================= INSIGHT SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-card p-6">
          <h3 className="text-foreground text-lg font-bold mb-4">
            Payment Method Breakdown
          </h3>

          <div className="bg-white rounded-card space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.method} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {method.method}
                  </span>
                  <span className="text-gray-500">
                    {method.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{method.count} transactions</span>
                  <span>Rp {method.total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Items */}
        <div className="bg-white rounded-card p-6">
          <h3 className="text-foreground text-lg font-bold mb-4">
            Best Selling Items
          </h3>

          <div className="bg-white rounded-card space-y-3">
            {bestSellingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-icon flex items-center justify-center ${
                      item.type === "product"
                        ? "bg-accent-teal"
                        : "bg-accent-peach"
                    }`}
                  >
                    <Package className="w-5 h-5 text-foreground" />
                  </div>

                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.type === "product" ? "Product" : "Combo"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-sm text-foreground">
                    {item.quantity} sold
                  </p>
                  <p className="text-xs text-gray-500">
                    Rp {item.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= OPERATIONAL SNAPSHOTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-card p-6">
          <h3 className="text-foreground text-lg font-bold mb-4">
            Low Stock Alerts
          </h3>

          <div className="bg-white rounded-card space-y-3">
            {lowStockAlerts.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Min stock: {item.minStock}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-error">
                    {item.stock} left
                  </span>
                  <Button variant="outline" size="sm">
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-card p-6">
          <h3 className="text-foreground text-lg font-bold mb-4">
            Recent Transactions
          </h3>

          <div className="bg-white rounded-card space-y-3">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {transaction.invoice_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.customer_name || "Guest"} •{" "}
                    {new Date(transaction.created_at).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-medium text-sm text-foreground">
                    Rp {transaction.final_amount.toLocaleString("id-ID")}
                  </p>

                  {transaction.is_void ? (
                    <span className="inline-block bg-error-light text-error-dark text-xs font-medium px-2 py-0.5 rounded-full">
                      Voided
                    </span>
                  ) : transaction.is_refund ? (
                    <span className="inline-block bg-warning-light text-warning-dark text-xs font-medium px-2 py-0.5 rounded-full">
                      Refunded
                    </span>
                  ) : (
                    <span className="inline-block bg-success-light text-success-dark text-xs font-medium px-2 py-0.5 rounded-full">
                      Paid
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-3 text-center">
              <Button variant="outline" size="sm">
                View All Transactions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
