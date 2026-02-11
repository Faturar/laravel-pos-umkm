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
import { CreditCard, DollarSign, AlertCircle, Clock } from "lucide-react"

interface Payment {
  id: string
  date: string
  paymentType: string
  description: string
  amount: number
  status: "Paid" | "Pending" | "Cancelled"
  createdBy: string
  dueDate?: string
  notes?: string
}

export default function FinancePaymentsPage() {
  const [dateRange, setDateRange] = useState("this_month")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const [formData, setFormData] = useState({
    paymentType: "",
    amount: "",
    description: "",
    dueDate: "",
    notes: "",
  })

  const paymentStats = {
    totalPayments: 24,
    totalPaidAmount: 18500000,
    totalPending: 6,
    totalCancelled: 3,
  }

  const paymentsData: Payment[] = [
    {
      id: "PAY-001",
      date: "2024-01-07",
      paymentType: "Supplier",
      description: "Payment to ABC Supplier",
      amount: 2500000,
      status: "Paid",
      createdBy: "John Doe",
      dueDate: "2024-01-10",
      notes: "Monthly supplier payment",
    },
    {
      id: "PAY-002",
      date: "2024-01-06",
      paymentType: "Expense",
      description: "Office utilities",
      amount: 850000,
      status: "Pending",
      createdBy: "Jane Smith",
      dueDate: "2024-01-15",
      notes: "Electricity and water bill",
    },
    {
      id: "PAY-003",
      date: "2024-01-05",
      paymentType: "Other",
      description: "Equipment maintenance",
      amount: 1200000,
      status: "Paid",
      createdBy: "John Doe",
      dueDate: "2024-01-08",
      notes: "POS machine maintenance",
    },
    {
      id: "PAY-004",
      date: "2024-01-04",
      paymentType: "Supplier",
      description: "Raw materials",
      amount: 3500000,
      status: "Cancelled",
      createdBy: "Jane Smith",
      dueDate: "2024-01-12",
      notes: "Cancelled due to quality issues",
    },
    {
      id: "PAY-005",
      date: "2024-01-03",
      paymentType: "Expense",
      description: "Marketing expenses",
      amount: 750000,
      status: "Paid",
      createdBy: "John Doe",
      dueDate: "2024-01-10",
      notes: "Digital marketing campaign",
    },
    {
      id: "PAY-006",
      date: "2024-01-02",
      paymentType: "Other",
      description: "License renewal",
      amount: 1500000,
      status: "Pending",
      createdBy: "Jane Smith",
      dueDate: "2024-01-20",
      notes: "Business license renewal",
    },
  ]

  type PaymentData = (typeof paymentsData)[number]

  const paymentColumns = [
    { header: "Date", accessorKey: "date" as keyof PaymentData },
    { header: "Payment ID", accessorKey: "id" as keyof PaymentData },
    { header: "Payment Type", accessorKey: "paymentType" as keyof PaymentData },
    { header: "Description", accessorKey: "description" as keyof PaymentData },
    {
      header: "Amount",
      accessorKey: "amount" as keyof PaymentData,
      cell: (row: PaymentData) => `Rp ${row.amount.toLocaleString("id-ID")}`,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof PaymentData,
      cell: (row: PaymentData) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Paid"
              ? "bg-green-100 text-green-700"
              : row.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { header: "Created By", accessorKey: "createdBy" as keyof PaymentData },
    {
      header: "Actions",
      accessorKey: "actions" as keyof PaymentData,
      cell: (row: PaymentData) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPayment(row)
              setIsDetailModalOpen(true)
            }}
          >
            View
          </Button>
          {row.status === "Pending" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // In a real app, this would update the payment status
                console.log("Mark as paid:", row.id)
              }}
            >
              Mark as Paid
            </Button>
          )}
        </div>
      ),
    },
  ]

  const handleCreatePayment = () => {
    // In a real app, this would submit to an API
    console.log("Creating payment:", formData)
    setIsCreateModalOpen(false)
    setFormData({
      paymentType: "",
      amount: "",
      description: "",
      dueDate: "",
      notes: "",
    })
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* ================= HEADER ================= */}
        <div>
          <PageHeader
            title="Finance Payments"
            description="Manage and track outgoing and incoming financial payments"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-wrap gap-3">
              <DateRangeSelect value={dateRange} onChange={setDateRange} />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={paymentTypeFilter}
                onValueChange={setPaymentTypeFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Payment
            </Button>
          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Payments"
            value={paymentStats.totalPayments.toString()}
            icon={<CreditCard className="w-8 h-8 text-blue-600" />}
            iconBg="bg-blue-100"
          />

          <StatCard
            title="Total Paid Amount"
            value={`Rp ${paymentStats.totalPaidAmount.toLocaleString("id-ID")}`}
            icon={<DollarSign className="w-8 h-8 text-green-600" />}
            iconBg="bg-green-100"
          />

          <StatCard
            title="Total Pending"
            value={paymentStats.totalPending.toString()}
            icon={<Clock className="w-8 h-8 text-yellow-600" />}
            iconBg="bg-yellow-100"
          />

          <StatCard
            title="Total Cancelled"
            value={paymentStats.totalCancelled.toString()}
            icon={<AlertCircle className="w-8 h-8 text-red-600" />}
            iconBg="bg-red-100"
          />
        </div>

        {/* ================= MAIN TABLE ================= */}
        <section className="bg-white border border-border rounded-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Payment Records</h3>
            <p className="text-sm text-gray-500">
              All financial payment records
            </p>
          </div>

          <DataTable
            columns={paymentColumns}
            data={paymentsData}
            meta={{
              page: 1,
              per_page: 10,
              total: paymentsData.length,
              total_pages: 1,
            }}
          />
        </section>
      </div>

      {/* ================= CREATE PAYMENT MODAL ================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Payment"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Supplier">Supplier</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayment}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* ================= PAYMENT DETAIL MODAL ================= */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-medium">{selectedPayment.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedPayment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Type</p>
                <p className="font-medium">{selectedPayment.paymentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-medium ${
                    selectedPayment.status === "Paid"
                      ? "text-green-600"
                      : selectedPayment.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {selectedPayment.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">
                  Rp {selectedPayment.amount.toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{selectedPayment.createdBy}</p>
              </div>
              {selectedPayment.dueDate && (
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{selectedPayment.dueDate}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{selectedPayment.description}</p>
            </div>

            {selectedPayment.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium">{selectedPayment.notes}</p>
              </div>
            )}

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
