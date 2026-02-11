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
import { reportService } from "@/lib/api/report"
import { SalesSummary, ReportFilters } from "@/lib/api/report"
import { Download, Calendar, Filter } from "lucide-react"

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

export default function SalesReportPage() {
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesSummary[]>([])
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: formatDate(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_to: formatDate(new Date(), "yyyy-MM-dd"),
  })
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })
  const [outlets, setOutlets] = useState<{ id: number; name: string }[]>([])
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  )
  const [paymentMethods, setPaymentMethods] = useState<
    { id: number; name: string }[]
  >([])

  useEffect(() => {
    fetchSalesData()
    fetchReferenceData()
  }, [filters])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const response = await reportService.getSalesSummary(filters)
      setSalesData(response.data)
    } catch (error) {
      console.error("Error fetching sales data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReferenceData = async () => {
    try {
      // Fetch outlets, categories, and payment methods for filters
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
        "sales-summary",
        filters,
        format,
      )

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `sales-report-${format === "csv" ? "data" : format}.${format}`
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
      header: "Date",
      accessorKey: "date",
      cell: (row: SalesSummary) =>
        row.date ? formatDate(new Date(row.date), "MMM dd, yyyy") : "-",
    },
    {
      header: "Total Sales",
      accessorKey: "total_sales",
      cell: (row: SalesSummary) =>
        `Rp ${row.total_sales?.toLocaleString() || 0}`,
    },
    {
      header: "Transactions",
      accessorKey: "total_transactions",
      cell: (row: SalesSummary) => row.total_transactions || 0,
    },
    {
      header: "Avg. Transaction",
      accessorKey: "average_transaction_value",
      cell: (row: SalesSummary) =>
        `Rp ${row.average_transaction_value?.toLocaleString() || 0}`,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="View sales performance and trends"
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
          </div>
        </div>
      </Card>

      {/* Sales Summary Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading sales data...</div>
            </div>
          ) : (
            <DataTable columns={columns} data={salesData} meta={meta} />
          )}
        </div>
      </Card>

      {/* Sales Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                Sales chart will be displayed here
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
