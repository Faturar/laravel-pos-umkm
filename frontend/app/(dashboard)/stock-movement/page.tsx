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
import {
  Calendar,
  Store,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Package,
  BarChart3,
  Eye,
} from "lucide-react"

// Mock data for demonstration
const mockStockMovementData = [
  {
    id: 1,
    date: "2026-02-10 14:30",
    product: "Coca-Cola 330ml",
    sku: "CC-330",
    movementType: "Stock In",
    quantity: 24,
    reference: "PO-001",
    user: "Admin User",
  },
  {
    id: 2,
    date: "2026-02-10 15:45",
    product: "Sprite 330ml",
    sku: "SP-330",
    movementType: "Sales deduction",
    quantity: -5,
    reference: "TRX-001",
    user: "Cashier",
  },
  {
    id: 3,
    date: "2026-02-09 10:20",
    product: "Fanta 330ml",
    sku: "FA-330",
    movementType: "Adjustment",
    quantity: 10,
    reference: "ADJ-001",
    user: "Manager",
  },
  {
    id: 4,
    date: "2026-02-09 11:30",
    product: "Coca-Cola 330ml",
    sku: "CC-330",
    movementType: "Transfer",
    quantity: -12,
    reference: "TRF-001",
    user: "Admin User",
  },
  {
    id: 5,
    date: "2026-02-08 09:15",
    product: "Sprite 330ml",
    sku: "SP-330",
    movementType: "Stock Out",
    quantity: -8,
    reference: "STO-001",
    user: "Manager",
  },
]

const columns = [
  {
    accessorKey: "date",
    header: "Date & Time",
  },
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "movementType",
    header: "Movement Type",
    cell: ({ row }) => {
      const type = row.getValue("movementType")
      const getBadgeColor = () => {
        switch (type) {
          case "Stock In":
            return "bg-green-100 text-green-800"
          case "Stock Out":
            return "bg-red-100 text-red-800"
          case "Adjustment":
            return "bg-yellow-100 text-yellow-800"
          case "Sales deduction":
            return "bg-blue-100 text-blue-800"
          case "Transfer":
            return "bg-purple-100 text-purple-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}
        >
          {type}
        </span>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity")
      const isPositive = quantity > 0

      return (
        <span
          className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {isPositive ? "+" : ""}
          {quantity}
        </span>
      )
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "user",
    header: "Performed By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <Eye className="w-4 h-4" />
      </Button>
    ),
  },
]

interface StockMovementItem {
  id: number
  date: string
  product: string
  sku: string
  movementType: string
  quantity: number
  reference: string
  user: string
}

export default function StockMovementPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [movementType, setMovementType] = useState("all")
  const [selectedMovement, setSelectedMovement] =
    useState<StockMovementItem | null>(null)

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Stock Movement"
        description="Track and monitor inventory changes"
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
                <SelectItem value="sales-deduction">Sales deduction</SelectItem>
                <SelectItem value="manual-adjustment">
                  Manual adjustment
                </SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input placeholder="Search products..." className="w-64" />
          </div>

          <Button className="ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Adjust Stock
          </Button>
        </div>
      </Card>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Movements</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock In</p>
              <p className="text-2xl font-bold text-green-600">650</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock Out</p>
              <p className="text-2xl font-bold text-red-600">420</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Change</p>
              <p className="text-2xl font-bold text-blue-600">+230</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* ================= MAIN TABLE ================= */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Movement History</h3>
        <StockMovementTable data={mockStockMovementData} />
      </Card>

      {/* ================= SIDE DRAWER (DETAIL VIEW) ================= */}
      {selectedMovement && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-gray-200 z-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Movement Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMovement(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-medium">{selectedMovement.product}</p>
                <p className="text-sm text-gray-500">
                  SKU: {selectedMovement.sku}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Movement Type</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMovement.movementType === "Stock In"
                      ? "bg-green-100 text-green-800"
                      : selectedMovement.movementType === "Stock Out"
                        ? "bg-red-100 text-red-800"
                        : selectedMovement.movementType === "Adjustment"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedMovement.movementType === "Sales deduction"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {selectedMovement.movementType}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p
                  className={`font-medium ${selectedMovement.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedMovement.quantity > 0 ? "+" : ""}
                  {selectedMovement.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Before Stock</p>
                <p className="font-medium">50 units</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">After Stock</p>
                <p className="font-medium">
                  {50 + selectedMovement.quantity} units
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Movement Reason</p>
                <p className="font-medium">
                  {selectedMovement.movementType === "Stock In"
                    ? "Supplier restock"
                    : selectedMovement.movementType === "Stock Out"
                      ? "Manual stock removal"
                      : selectedMovement.movementType === "Adjustment"
                        ? "Inventory correction"
                        : selectedMovement.movementType === "Sales deduction"
                          ? "Product sold"
                          : "Stock transfer between outlets"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="font-medium">{selectedMovement.date}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Performed By</p>
                <p className="font-medium">{selectedMovement.user}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Reference</p>
                <p className="font-medium">{selectedMovement.reference}</p>
              </div>

              {selectedMovement.movementType === "Sales deduction" && (
                <div>
                  <p className="text-sm text-gray-600">Linked Transaction</p>
                  <p className="font-medium text-blue-600 cursor-pointer hover:underline">
                    View Transaction #{selectedMovement.reference}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
