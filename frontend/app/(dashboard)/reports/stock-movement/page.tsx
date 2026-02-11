"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { OutletSelect } from "@/components/ui/OutletSelect"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { StockMovementTable } from "@/components/ui/StockMovementTable"
import { StatCard } from "@/components/dashboard/StatCard"
import StockMovementChart from "@/components/dashboard/StockMovementChart"
import {
  Calendar,
  Store,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  BarChart3,
  Plus,
  Minus,
} from "lucide-react"

// Mock data for demonstration
const mockStockMovementData = [
  {
    id: 1,
    date: "2026-02-10",
    product: "Coca-Cola 330ml",
    sku: "CC-330",
    movementType: "Stock In",
    quantity: 24,
    reference: "PO-001",
    user: "Admin User",
  },
  {
    id: 2,
    date: "2026-02-10",
    product: "Sprite 330ml",
    sku: "SP-330",
    movementType: "Sales deduction",
    quantity: -5,
    reference: "TRX-001",
    user: "Cashier",
  },
  {
    id: 3,
    date: "2026-02-09",
    product: "Fanta 330ml",
    sku: "FA-330",
    movementType: "Adjustment",
    quantity: 10,
    reference: "ADJ-001",
    user: "Manager",
  },
  {
    id: 4,
    date: "2026-02-09",
    product: "Coca-Cola 330ml",
    sku: "CC-330",
    movementType: "Transfer",
    quantity: -12,
    reference: "TRF-001",
    user: "Admin User",
  },
  {
    id: 5,
    date: "2026-02-08",
    product: "Sprite 330ml",
    sku: "SP-330",
    movementType: "Stock Out",
    quantity: -8,
    reference: "STO-001",
    user: "Manager",
  },
]

const mockChartData = [
  { date: "2026-02-05", stockIn: 100, stockOut: 80 },
  { date: "2026-02-06", stockIn: 120, stockOut: 90 },
  { date: "2026-02-07", stockIn: 80, stockOut: 110 },
  { date: "2026-02-08", stockIn: 150, stockOut: 100 },
  { date: "2026-02-09", stockIn: 90, stockOut: 120 },
  { date: "2026-02-10", stockIn: 110, stockOut: 95 },
]

const mockMovementByType = [
  { type: "Sales deduction", value: 450 },
  { type: "Manual adjustment", value: 200 },
  { type: "Supplier restock", value: 650 },
  { type: "Transfer", value: 120 },
]

const mockAffectedProducts = [
  { name: "Coca-Cola 330ml", totalMovement: 36, stockIn: 24, stockOut: 12 },
  { name: "Sprite 330ml", totalMovement: 13, stockIn: 0, stockOut: 13 },
  { name: "Fanta 330ml", totalMovement: 10, stockIn: 10, stockOut: 0 },
]

export default function StockMovementReportPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [movementType, setMovementType] = useState("all")
  const [chartView, setChartView] = useState("daily")

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Stock Movement Report"
        description="Inventory changes and stock activity over time"
      />

      {/* ================= FILTERS ================= */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <DateRangeSelect value={dateRange} onChange={setDateRange} />
          </div>

          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-gray-500" />
            <OutletSelect />
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <Select value={movementType} onValueChange={setMovementType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Movement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="stock-in">Stock In</SelectItem>
                <SelectItem value="stock-out">Stock Out</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="sales-deduction">Sales deduction</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input placeholder="Search products..." className="w-64" />
          </div>

          <Button variant="outline" className="ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* ================= KPI SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock In"
          value="650"
          subtitle="+12% vs previous period"
          subtitleColor="success"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Total Stock Out"
          value="420"
          subtitle="-8% vs previous period"
          subtitleColor="error"
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-red-100"
        />
        <StatCard
          title="Net Movement"
          value="230"
          subtitle="+4% vs previous period"
          subtitleColor="success"
          icon={<Package className="w-5 h-5" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Adjustments"
          value="200"
          subtitle="+15% vs previous period"
          subtitleColor="success"
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-yellow-100"
        />
      </div>

      {/* ================= MAIN CHART ================= */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Stock In vs Stock Out</h3>
          <div className="flex gap-2">
            <Button
              variant={chartView === "daily" ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartView("daily")}
            >
              Daily
            </Button>
            <Button
              variant={chartView === "weekly" ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartView("weekly")}
            >
              Weekly
            </Button>
          </div>
        </div>
        <div className="h-80">
          <StockMovementChart data={mockChartData} />
        </div>
      </Card>

      {/* ================= BREAKDOWN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movement by Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Movement by Type</h3>
          <div className="space-y-3">
            {mockMovementByType.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{item.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(item.value / 650) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Most Affected Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Affected Products</h3>
          <div className="space-y-3">
            {mockAffectedProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    Total: {product.totalMovement}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">+{product.stockIn}</span>
                  <span className="text-red-600">-{product.stockOut}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ================= DETAILED TABLE ================= */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Movement Details</h3>
        <StockMovementTable data={mockStockMovementData} />
      </Card>
    </div>
  )
}
