"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { transactionService } from "@/lib/api/transaction"
import { Transaction } from "@/types/transaction"
import {
  ArrowLeft,
  Edit,
  Receipt,
  DollarSign,
  Calendar,
  User,
  Store,
} from "lucide-react"
import Link from "next/link"

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const transactionId = Number(params.id)

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (transactionId) {
      fetchTransaction()
    }
  }, [transactionId])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionService.getTransaction(transactionId)
      setTransaction(response.data)
    } catch (err) {
      setError("Failed to fetch transaction details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVoidTransaction = async () => {
    if (!transaction) return

    if (!confirm("Are you sure you want to void this transaction?")) {
      return
    }

    try {
      const reason = prompt(
        "Please enter a reason for voiding this transaction:",
      )
      if (!reason) return

      await transactionService.voidTransaction(transaction.id, reason)
      await fetchTransaction() // Refresh the data
    } catch (err) {
      console.error("Failed to void transaction:", err)
      alert("Failed to void transaction")
    }
  }

  const handleRefundTransaction = async () => {
    if (!transaction) return

    if (!confirm("Are you sure you want to refund this transaction?")) {
      return
    }

    try {
      const refundAmount = prompt(
        "Enter refund amount:",
        transaction.final_amount.toString(),
      )
      if (!refundAmount) return

      const refundReason = prompt(
        "Please enter a reason for refunding this transaction:",
      )
      if (!refundReason) return

      await transactionService.refundTransaction(transaction.id, {
        refund_amount: parseFloat(refundAmount),
        refund_reason: refundReason,
      })
      await fetchTransaction() // Refresh the data
    } catch (err) {
      console.error("Failed to refund transaction:", err)
      alert("Failed to refund transaction")
    }
  }

  const handlePrintReceipt = async () => {
    if (!transaction) return

    try {
      await transactionService.generateReceipt(transaction.id)
      // In a real app, this would open a print dialog or show a receipt preview
      alert("Receipt generated successfully")
    } catch (err) {
      console.error("Failed to generate receipt:", err)
      alert("Failed to generate receipt")
    }
  }

  const getStatusBadge = () => {
    if (!transaction) return null

    let variant: "default" | "secondary" | "destructive" | "outline" = "default"

    if (transaction.is_void) {
      variant = "destructive"
    } else if (transaction.is_refund) {
      variant = "secondary"
    } else if (transaction.status === "completed") {
      variant = "default"
    } else {
      variant = "outline"
    }

    const statusText = transaction.is_void
      ? "Voided"
      : transaction.is_refund
        ? "Refunded"
        : transaction.status

    return <Badge variant={variant}>{statusText}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading transaction details...</div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-600 mb-4">
          {error || "Transaction not found"}
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Details"
        description="View transaction information"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Receipt className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            {!transaction.is_void && !transaction.is_refund && (
              <>
                <Button variant="outline" onClick={handleVoidTransaction}>
                  Void Transaction
                </Button>
                <Button variant="outline" onClick={handleRefundTransaction}>
                  Refund Transaction
                </Button>
              </>
            )}
            <Link href={`/transactions/${transaction.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        }
      />

      {/* Transaction Overview */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {transaction.invoice_number}
              </h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(transaction.created_at).toLocaleString()}
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Total Amount
              </div>
              <div className="text-xl font-bold">
                Rp {transaction.final_amount.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                Payment Method
              </div>
              <div className="text-xl font-bold">
                {transaction.payment_method}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <User className="h-4 w-4 mr-1" />
                Cashier ID
              </div>
              <div className="text-xl font-bold">{transaction.cashier_id}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Store className="h-4 w-4 mr-1" />
                Outlet ID
              </div>
              <div className="text-xl font-bold">{transaction.outlet_id}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>Rp {transaction.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span>
                  -Rp {transaction.discount_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>Rp {transaction.tax_amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charge:</span>
                <span>
                  Rp {transaction.service_charge_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    Rp {transaction.total_amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid:</span>
                <span>
                  Rp {transaction.paid_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change:</span>
                <span>
                  Rp {transaction.change_amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Additional Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Payment Reference:</span>
                <div className="mt-1">
                  {transaction.payment_reference || "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Customer ID:</span>
                <div className="mt-1">{transaction.customer_id || "-"}</div>
              </div>
              <div>
                <span className="text-gray-600">Notes:</span>
                <div className="mt-1">{transaction.notes || "-"}</div>
              </div>
              {transaction.void_reason && (
                <div>
                  <span className="text-gray-600">Void Reason:</span>
                  <div className="mt-1 text-red-600">
                    {transaction.void_reason}
                  </div>
                </div>
              )}
              {transaction.refund_reason && (
                <div>
                  <span className="text-gray-600">Refund Reason:</span>
                  <div className="mt-1 text-yellow-600">
                    {transaction.refund_reason}
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Sync Status:</span>
                <div className="mt-1">
                  {transaction.is_synced ? (
                    <Badge variant="default">Synced</Badge>
                  ) : (
                    <Badge variant="outline">Not Synced</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Items */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* This would be populated with actual transaction items */}
                <tr>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    colSpan={5}
                  >
                    Transaction items will be displayed here
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
