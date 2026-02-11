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
import { ReportFilters } from "@/lib/api/report"
import { Download, Calendar, Filter, DollarSign } from "lucide-react"

// Define CashFlowData interface
interface CashFlowData {
  id: number
  date: string
  outlet_name: string
  opening_balance: number
  cash_sales: number
  other_income: number
  expenses: number
  closing_balance: number
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

export default function CashReportPage() {
  const [loading, setLoading] = useState(true)
  const [cashData, setCashData] = useState<CashFlowData[]>([])
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: formatDate(subDays(new Date(), 7), "yyyy-MM-dd"),
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
    fetchCashData()
    fetchReferenceData()
  }, [filters])

  const fetchCashData = async () => {
    try {
      setLoading(true)
      // For now, we'll use a mock data structure since the specific endpoint for cash report might not exist
      // In a real implementation, this would call a specific endpoint for cash flow data
      const response = await reportService.getSalesByPaymentMethod(filters)

      // Transform the sales data to fit cash report structure
      const transformedData: CashFlowData[] = response.data.map(
        (item, index) => ({
          id: index, // Use index as a fallback since PaymentMethodSummary might not have id
          date: new Date().toISOString().split("T")[0], // Use today's date since it might not be in the response
          outlet_name: "All Outlets", // Use default since it might not be in the response
          opening_balance: 0, // This would come from a different endpoint
          cash_sales: item.total_amount || 0,
          other_income: 0, // This would come from a different endpoint
          expenses: 0, // This would come from a different endpoint
          closing_balance: 0, // This would be calculated
        }),
      )

      setCashData(transformedData)
    } catch (error) {
      console.error("Error fetching cash data:", error)
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
      const blob = await reportService.exportReport("cash", filters, format)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cash-report-${format === "csv" ? "data" : format}.${format}`
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
      cell: (row: CashFlowData) =>
        formatDate(new Date(row.date), "MMM dd, yyyy"),
    },
    {
      header: "Outlet",
      accessorKey: "outlet_name",
      cell: (row: CashFlowData) => row.outlet_name || "All Outlets",
    },
    {
      header: "Opening Balance",
      accessorKey: "opening_balance",
      cell: (row: CashFlowData) =>
        `Rp ${row.opening_balance?.toLocaleString() || 0}`,
    },
    {
      header: "Cash Sales",
      accessorKey: "cash_sales",
      cell: (row: CashFlowData) =>
        `Rp ${row.cash_sales?.toLocaleString() || 0}`,
    },
    {
      header: "Other Income",
      accessorKey: "other_income",
      cell: (row: CashFlowData) =>
        `Rp ${row.other_income?.toLocaleString() || 0}`,
    },
    {
      header: "Expenses",
      accessorKey: "expenses",
      cell: (row: CashFlowData) => `Rp ${row.expenses?.toLocaleString() || 0}`,
    },
    {
      header: "Closing Balance",
      accessorKey: "closing_balance",
      cell: (row: CashFlowData) =>
        `Rp ${row.closing_balance?.toLocaleString() || 0}`,
    },
  ]

  // Calculate totals
  const totals = cashData.reduce(
    (acc, item) => {
      acc.opening_balance += item.opening_balance || 0
      acc.cash_sales += item.cash_sales || 0
      acc.other_income += item.other_income || 0
      acc.expenses += item.expenses || 0
      acc.closing_balance += item.closing_balance || 0
      return acc
    },
    {
      opening_balance: 0,
      cash_sales: 0,
      other_income: 0,
      expenses: 0,
      closing_balance: 0,
    },
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Report"
        description="View cash flow and balance information"
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

      {/* Cash Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Cash Sales
                </p>
                <p className="text-2xl font-bold">
                  Rp {totals.cash_sales.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Income
                </p>
                <p className="text-2xl font-bold">
                  Rp{" "}
                  {(totals.cash_sales + totals.other_income).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-md">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold">
                  Rp {totals.expenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Net Cash Flow
                </p>
                <p className="text-2xl font-bold">
                  Rp{" "}
                  {(
                    totals.cash_sales +
                    totals.other_income -
                    totals.expenses
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Details</h3>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading cash data...</div>
            </div>
          ) : (
            <DataTable columns={columns} data={cashData} meta={meta} />
          )}
        </div>
      </Card>

      {/* Cash Flow Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                Cash flow chart will be displayed here
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
