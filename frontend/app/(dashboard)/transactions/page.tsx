"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { getTransactionColumns } from "./columns"
import { transactionService } from "@/lib/api/transaction"
import { Transaction } from "@/types/transaction"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionService.getTransactions()
      setTransactions(response.data || [])
    } catch (err) {
      setError("Failed to fetch transactions")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewTransaction = (transaction: Transaction) => {
    // This will be implemented when we create the detail page
    console.log("View transaction:", transaction)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    // This will be implemented when we create the edit page
    console.log("Edit transaction:", transaction)
  }

  const handleVoidTransaction = async (transaction: Transaction) => {
    if (!confirm("Are you sure you want to void this transaction?")) {
      return
    }

    try {
      const reason = prompt(
        "Please enter a reason for voiding this transaction:",
      )
      if (!reason) return

      await transactionService.voidTransaction(transaction.id, reason)
      await fetchTransactions() // Refresh the list
    } catch (err) {
      console.error("Failed to void transaction:", err)
      alert("Failed to void transaction")
    }
  }

  const handleRefundTransaction = async (transaction: Transaction) => {
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
      await fetchTransactions() // Refresh the list
    } catch (err) {
      console.error("Failed to refund transaction:", err)
      alert("Failed to refund transaction")
    }
  }

  const columns = getTransactionColumns({
    onView: handleViewTransaction,
    onEdit: handleEditTransaction,
    onVoid: handleVoidTransaction,
    onRefund: handleRefundTransaction,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage and view all transactions"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Link href="/transactions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="text-red-700">{error}</div>
        </Card>
      )}

      <Card>
        <DataTable
          columns={columns}
          data={transactions}
          meta={{
            page: 1,
            per_page: 10,
            total: transactions.length,
            total_pages: Math.ceil(transactions.length / 10),
          }}
        />
      </Card>
    </div>
  )
}
