"use client"

import { Transaction } from "@/types/transaction"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface TransactionColumnsProps {
  onView?: (transaction: Transaction) => void
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  onVoid?: (transaction: Transaction) => void
  onRefund?: (transaction: Transaction) => void
}

export function getTransactionColumns({
  onView,
  onEdit,
  onDelete,
  onVoid,
  onRefund,
}: TransactionColumnsProps = {}) {
  return [
    {
      accessorKey: "invoice_number" as keyof Transaction,
      header: "Invoice",
      cell: (transaction: Transaction) => (
        <div className="font-medium">{transaction.invoice_number}</div>
      ),
    },
    {
      accessorKey: "created_at" as keyof Transaction,
      header: "Date",
      cell: (transaction: Transaction) => (
        <div>{new Date(transaction.created_at).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "final_amount" as keyof Transaction,
      header: "Amount",
      cell: (transaction: Transaction) => (
        <div className="font-medium">
          Rp {transaction.final_amount.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "payment_method" as keyof Transaction,
      header: "Payment Method",
      cell: (transaction: Transaction) => (
        <div>{transaction.payment_method}</div>
      ),
    },
    {
      accessorKey: "status" as keyof Transaction,
      header: "Status",
      cell: (transaction: Transaction) => {
        let variant: "default" | "secondary" | "destructive" | "outline" =
          "default"

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
      },
    },
    {
      accessorKey: "cashier_id" as keyof Transaction,
      header: "Cashier",
      cell: (transaction: Transaction) => <div>{transaction.cashier_id}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (transaction: Transaction) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(transaction)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && !transaction.is_void && !transaction.is_refund && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(transaction)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onVoid && !transaction.is_void && !transaction.is_refund && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVoid(transaction)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {onRefund && !transaction.is_void && !transaction.is_refund && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRefund(transaction)}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/transactions/${transaction.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
