"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { transactionService } from "@/lib/api/transaction"
import { Transaction } from "@/types/transaction"
import { ArrowLeft, Edit, Trash2, Printer } from "lucide-react"
import Link from "next/link"

export default function TransactionDetailPage() {
  const params = useParams()
  const transactionId = params.id as string
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
      const response = await transactionService.getTransaction(
        parseInt(transactionId),
      )
      setTransaction(response.data)
    } catch (err) {
      setError("Failed to fetch transaction")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVoidTransaction = async () => {
    if (
      !transaction ||
      !confirm("Are you sure you want to void this transaction?")
    ) {
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
    if (
      !transaction ||
      !confirm("Are you sure you want to refund this transaction?")
    ) {
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
      const receipt = await transactionService.generateReceipt(transaction.id)
      // In a real app, this would open a print dialog or show a receipt preview
      window.print()
    } catch (err) {
      console.error("Failed to generate receipt:", err)
      alert("Failed to generate receipt")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading transaction details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Transaction not found</div>
      </div>
    )
  }

  const statusVariant = transaction.is_void
    ? "destructive"
    : transaction.is_refund
      ? "secondary"
      : transaction.status === "completed"
        ? "default"
        : "outline"

  const statusText = transaction.is_void
    ? "Voided"
    : transaction.is_refund
      ? "Refunded"
      : transaction.status

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Transaction #${transaction.invoice_number}`}
        description="View transaction details"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            {!transaction.is_void && !transaction.is_refund && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoidTransaction}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Void
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefundTransaction}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Refund
                </Button>
              </>
            )}
            <Link href="/transactions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Transactions
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Transaction Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number:</span>
                <span className="font-medium">
                  {transaction.invoice_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{new Date(transaction.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={statusVariant}>{statusText}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span>{transaction.payment_method}</span>
              </div>
              {transaction.payment_reference && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Reference:</span>
                  <span>{transaction.payment_reference}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Amount Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>Rp {transaction.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount:</span>
                <span>
                  Rp {transaction.discount_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax:</span>
                <span>Rp {transaction.tax_amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Charge:</span>
                <span>
                  Rp {transaction.service_charge_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span>
                  Rp {transaction.total_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Final Amount:</span>
                <span>
                  Rp {transaction.final_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid Amount:</span>
                <span>
                  Rp {transaction.paid_amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Change:</span>
                <span>
                  Rp {transaction.change_amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {transaction.notes && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{transaction.notes}</p>
          </div>
        </Card>
      )}

      {transaction.void_reason && (
        <Card className="bg-red-50 border-red-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-red-700">
              Void Reason
            </h3>
            <p className="text-red-600">{transaction.void_reason}</p>
          </div>
        </Card>
      )}

      {transaction.refund_reason && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-700">
              Refund Reason
            </h3>
            <p className="text-yellow-600">{transaction.refund_reason}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
