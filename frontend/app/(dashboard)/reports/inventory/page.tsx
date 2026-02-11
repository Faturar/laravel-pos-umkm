"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/Badge"
import { reportService } from "@/lib/api/report"
import { ReportFilters } from "@/lib/api/report"
import { Download, Calendar, Filter, Package } from "lucide-react"

// Define InventoryData interface
interface InventoryData {
  id: number
  name: string
  sku: string
  category_name: string
  current_stock: number
  min_stock: number
  stock_value: number
  last_restock?: string
}

// Simple date formatting function
const formatDate = (date: Date, formatStr: string): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  if (formatStr === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`
  } else if (formatStr === "MMM dd, yyyy") {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return `${monthNames[date.getMonth()]} ${day}, ${year}`
  }

  return `${year}-${month}-${day}`
}

// Simple date subtraction function
const subDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export default function InventoryReportPage() {
  const [loading, setLoading] = useState(true)
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([])
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: formatDate(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_to: formatDate(new Date(), "yyyy-MM-dd"),
  })
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  )
  const [outlets, setOutlets] = useState<{ id: number; name: string }[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchInventoryData()
    fetchReferenceData()
  }, [filters])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      // For now, we'll use a mock data structure since the specific endpoint for inventory report might not exist
      // In a real implementation, this would call a specific endpoint for inventory data
      const response = await reportService.getProductReport(filters)

      // Transform ProductReportData to InventoryData
      const transformedData: InventoryData[] = response.data.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        sku: item.sku || "",
        category_name: item.category_name || "Uncategorized",
        current_stock: item.quantity_sold || 0, // Using quantity_sold as a proxy for current stock
        min_stock: 0, // This would come from a different endpoint
        stock_value: item.total_revenue || 0, // Using total_revenue as a proxy for stock value
        last_restock: undefined, // This would come from a different endpoint
      }))

      setInventoryData(transformedData)
    } catch (error) {
      console.error("Error fetching inventory data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReferenceData = async () => {
    try {
      // Fetch categories and outlets for filters
      // This would typically be done through their respective services
      // For now, we'll use empty arrays
    } catch (error) {
      console.error("Error fetching reference data:", error)
    }
  }

  const handleFilterChange = (
    key: keyof ReportFilters,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const exportReport = async (format: "csv" | "xlsx" | "pdf" = "csv") => {
    try {
      const blob = await reportService.exportReport(
        "inventory",
        filters,
        format,
      )

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `inventory-report-${format === "csv" ? "data" : format}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting report:", error)
    }
  }

  const columns = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (row: InventoryData) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">SKU: {row.sku}</div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category_name",
      cell: (row: InventoryData) => row.category_name || "Uncategorized",
    },
    {
      header: "Current Stock",
      accessorKey: "current_stock",
      cell: (row: InventoryData) => {
        const stock = row.current_stock || 0
        const minStock = row.min_stock || 0
        const isLowStock = stock <= minStock

        return (
          <div>
            <div className="font-medium">{stock}</div>
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      header: "Stock Value",
      accessorKey: "stock_value",
      cell: (row: InventoryData) =>
        `Rp ${row.stock_value?.toLocaleString() || 0}`,
    },
    {
      header: "Last Restock",
      accessorKey: "last_restock",
      cell: (row: InventoryData) =>
        row.last_restock
          ? formatDate(new Date(row.last_restock), "MMM dd, yyyy")
          : "Never",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: InventoryData) => {
        const stock = row.current_stock || 0
        const minStock = row.min_stock || 0

        if (stock === 0) {
          return <Badge variant="destructive">Out of Stock</Badge>
        } else if (stock <= minStock) {
          return <Badge variant="destructive">Low Stock</Badge>
        } else {
          return <Badge variant="default">In Stock</Badge>
        }
      },
    },
  ]

  // Calculate totals
  const totals = inventoryData.reduce(
    (acc, item) => {
      acc.total_stock += item.current_stock || 0
      acc.total_value += item.stock_value || 0
      acc.low_stock_count += item.current_stock <= item.min_stock ? 1 : 0
      acc.out_of_stock_count += item.current_stock === 0 ? 1 : 0
      return acc
    },
    {
      total_stock: 0,
      total_value: 0,
      low_stock_count: 0,
      out_of_stock_count: 0,
    },
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Report"
        description="View inventory levels, stock values, and product status"
        rightSlot={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport("csv")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport("xlsx")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport("pdf")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  handleFilterChange("date_from", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange("date_to", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category_id?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "category_id",
                    value ? parseInt(value) : "",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outlet">Outlet</Label>
              <Select
                value={filters.outlet_id?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange("outlet_id", value ? parseInt(value) : "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Outlets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Outlets</SelectItem>
                  {outlets.map((outlet) => (
                    <SelectItem key={outlet.id} value={outlet.id.toString()}>
                      {outlet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold">{inventoryData.length}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold">{totals.total_stock}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold">{totals.low_stock_count}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-md">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold">
                  {totals.out_of_stock_count}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Details</h3>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading inventory data...</div>
            </div>
          ) : (
            <DataTable columns={columns} data={inventoryData} meta={meta} />
          )}
        </div>
      </Card>

      {/* Stock Distribution Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Stock Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                Stock distribution chart will be displayed here
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Integration with chart library needed
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
