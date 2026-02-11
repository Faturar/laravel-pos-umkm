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

// Define ComboData interface
interface ComboData {
  combo_id: number
  combo_name: string
  combo_code: string
  quantity: number
  total_amount: number
  percentage_of_total: number
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

export default function ComboReportPage() {
  const [loading, setLoading] = useState(true)
  const [comboData, setComboData] = useState<ComboData[]>([])
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: formatDate(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_to: formatDate(new Date(), "yyyy-MM-dd"),
  })
  const [outlets, setOutlets] = useState<{ id: number; name: string }[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchComboData()
    fetchReferenceData()
  }, [filters])

  const fetchComboData = async () => {
    try {
      setLoading(true)
      // For now, we'll use a mock data structure since the specific endpoint for combo report might not exist
      // In a real implementation, this would call a specific endpoint for combo data
      const response = await reportService.getComboSales(filters)

      // Transform ComboReport to ComboData
      const transformedData: ComboData[] = response.data.map((item) => ({
        combo_id: item.combo_id,
        combo_name:
          typeof item.combo_name === "string"
            ? item.combo_name
            : `Combo ${item.combo_name}`,
        combo_code: item.combo_code || "",
        quantity: item.quantity || 0,
        total_amount: item.total_amount || 0,
        percentage_of_total: item.percentage_of_total || 0,
      }))

      setComboData(transformedData)
    } catch (error) {
      console.error("Error fetching combo data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReferenceData = async () => {
    try {
      // Fetch outlets for filters
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
      const blob = await reportService.exportReport("combos", filters, format)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `combo-report-${format === "csv" ? "data" : format}.${format}`
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
      header: "Combo",
      accessorKey: "combo_name",
      cell: (row: ComboData) => (
        <div>
          <div className="font-medium">{row.combo_name}</div>
          <div className="text-sm text-gray-500">Code: {row.combo_code}</div>
        </div>
      ),
    },
    {
      header: "Quantity Sold",
      accessorKey: "quantity",
      cell: (row: ComboData) => row.quantity || 0,
    },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      cell: (row: ComboData) => `Rp ${row.total_amount?.toLocaleString() || 0}`,
    },
    {
      header: "Percentage of Total",
      accessorKey: "percentage_of_total",
      cell: (row: ComboData) => `${row.percentage_of_total?.toFixed(1) || 0}%`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: ComboData) => {
        const quantity = row.quantity || 0
        if (quantity === 0) {
          return <Badge variant="destructive">Not Sold</Badge>
        } else if (quantity < 10) {
          return <Badge variant="destructive">Low Sales</Badge>
        } else {
          return <Badge variant="default">Active</Badge>
        }
      },
    },
  ]

  // Calculate totals
  const totals = comboData.reduce(
    (acc, item) => {
      acc.total_quantity += item.quantity || 0
      acc.total_amount += item.total_amount || 0
      return acc
    },
    {
      total_quantity: 0,
      total_amount: 0,
    },
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Combo Report"
        description="View combo sales performance and analytics"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Combo Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Combos
                </p>
                <p className="text-2xl font-bold">{comboData.length}</p>
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
                <p className="text-sm font-medium text-gray-600">
                  Total Quantity Sold
                </p>
                <p className="text-2xl font-bold">{totals.total_quantity}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  Rp {totals.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Combo Sales Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Combo Sales Details</h3>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading combo data...</div>
            </div>
          ) : (
            <DataTable columns={columns} data={comboData} meta={meta} />
          )}
        </div>
      </Card>

      {/* Combo Sales Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Combo Sales Distribution
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                Combo sales distribution chart will be displayed here
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
