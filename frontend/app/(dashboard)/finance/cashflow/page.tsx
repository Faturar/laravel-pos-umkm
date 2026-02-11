"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { DateRangeSelect } from "@/components/ui/DateRangeSelect"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface CashFlowEntry {
  id: string
  dateTime: string
  type: string
  category: string
  reason: string
  amount: number
  createdBy: string
  notes: string
}

export default function CashFlowPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<CashFlowEntry | null>(null)

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    reason: "",
    category: "",
    notes: "",
  })

  const cashFlowStats = {
    cashIn: 8500000,
    cashOut: 3200000,
    netCash: 5300000,
  }

  const cashFlowData = [
    {
      id: "CF-001",
      dateTime: "2024-01-07 09:30",
      type: "Cash In",
      category: "Sales",
      reason: "Daily sales",
      amount: 2150000,
      createdBy: "John Doe",
      notes: "Morning sales collection",
    },
    {
      id: "CF-002",
      dateTime: "2024-01-07 11:45",
      type: "Cash Out",
      category: "Expense",
      reason: "Supplier payment",
      amount: 620000,
      createdBy: "Jane Smith",
      notes: "Payment to ABC Supplier",
    },
    {
      id: "CF-003",
      dateTime: "2024-01-06 14:20",
      type: "Cash In",
      category: "Transfer",
      reason: "Bank transfer",
      amount: 1500000,
      createdBy: "John Doe",
      notes: "Transfer from main account",
    },
    {
      id: "CF-004",
      dateTime: "2024-01-06 16:30",
      type: "Cash Out",
      category: "Refund",
      reason: "Customer refund",
      amount: 350000,
      createdBy: "Jane Smith",
      notes: "Refund for defective product",
    },
    {
      id: "CF-005",
      dateTime: "2024-01-05 10:15",
      type: "Cash In",
      category: "Other",
      reason: "Manual input",
      amount: 700000,
      createdBy: "John Doe",
      notes: "Additional capital injection",
    },
    {
      id: "CF-006",
      dateTime: "2024-01-05 13:45",
      type: "Cash Out",
      category: "Withdrawal",
      reason: "Owner withdrawal",
      amount: 500000,
      createdBy: "Jane Smith",
      notes: "Monthly profit withdrawal",
    },
  ]

  type CashFlowData = (typeof cashFlowData)[number]

  const cashFlowColumns = [
    { header: "Date & Time", accessorKey: "dateTime" as keyof CashFlowData },
    {
      header: "Type",
      accessorKey: "type" as keyof CashFlowData,
      cell: (row: CashFlowData) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.type === "Cash In"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    { header: "Category", accessorKey: "category" as keyof CashFlowData },
    { header: "Reason", accessorKey: "reason" as keyof CashFlowData },
    {
      header: "Amount",
      accessorKey: "amount" as keyof CashFlowData,
      cell: (row: CashFlowData) => (
        <span
          className={`font-medium ${
            row.type === "Cash In" ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.type === "Cash In" ? "+" : "-"}Rp{" "}
          {row.amount.toLocaleString("id-ID")}
        </span>
      ),
    },
    { header: "Created By", accessorKey: "createdBy" as keyof CashFlowData },
    {
      header: "Actions",
      accessorKey: "id" as keyof CashFlowData,
      cell: (row: CashFlowData) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(row)}
        >
          View
        </Button>
      ),
    },
  ]

  const handleAddEntry = () => {
    // In a real app, this would submit to an API
    console.log("Adding cash entry:", formData)
    setIsAddEntryModalOpen(false)
    setFormData({
      type: "",
      amount: "",
      reason: "",
      category: "",
      notes: "",
    })
  }

  const handleViewDetails = (entry: CashFlowEntry) => {
    setSelectedEntry(entry)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Cash Flow"
            description="Record and track cash in and cash out activities"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <DateRangeSelect value={dateRange} onChange={setDateRange} />
            <Button onClick={() => setIsAddEntryModalOpen(true)}>
              Add Cash Entry
            </Button>
          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Cash In"
            value={`Rp ${cashFlowStats.cashIn.toLocaleString("id-ID")}`}
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            iconBg="bg-green-100"
          />

          <StatCard
            title="Total Cash Out"
            value={`Rp ${cashFlowStats.cashOut.toLocaleString("id-ID")}`}
            icon={<TrendingDown className="w-8 h-8 text-red-600" />}
            iconBg="bg-red-100"
          />

          <StatCard
            title="Net Cash"
            value={`Rp ${cashFlowStats.netCash.toLocaleString("id-ID")}`}
            icon={<DollarSign className="w-8 h-8 text-blue-600" />}
            iconBg="bg-blue-100"
          />
        </div>

        {/* ================= MAIN TABLE ================= */}
        <section className="bg-white border border-border rounded-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Cash Flow Entries</h3>
            <p className="text-sm text-gray-500">
              All cash entries are permanent and cannot be modified
            </p>
          </div>

          <DataTable
            columns={cashFlowColumns}
            data={cashFlowData}
            meta={{
              page: 1,
              per_page: 10,
              total: cashFlowData.length,
              total_pages: 1,
            }}
          />
        </section>
      </div>

      {/* ================= ADD ENTRY MODAL ================= */}
      <Modal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
        title="Add Cash Entry"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash In">Cash In</SelectItem>
                <SelectItem value="Cash Out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Enter amount"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder="Enter reason"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Supplier Payment">
                  Supplier Payment
                </SelectItem>
                <SelectItem value="Refund">Refund</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes (optional)"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddEntryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* ================= DETAIL VIEW MODAL ================= */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Cash Entry Details"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reference ID</p>
                <p className="font-medium">{selectedEntry.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{selectedEntry.dateTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p
                  className={`font-medium ${
                    selectedEntry.type === "Cash In"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedEntry.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{selectedEntry.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p
                  className={`font-medium ${
                    selectedEntry.type === "Cash In"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedEntry.type === "Cash In" ? "+" : "-"}Rp{" "}
                  {selectedEntry.amount.toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{selectedEntry.createdBy}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="font-medium">{selectedEntry.reason}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{selectedEntry.notes || "No notes"}</p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
