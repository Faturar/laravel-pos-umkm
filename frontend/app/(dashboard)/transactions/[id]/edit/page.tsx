"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { transactionService } from "@/lib/api/transaction"
import { Transaction, TransactionFormData } from "@/types/transaction"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import Link from "next/link"

interface CartItem {
  product_id: number
  product_variant_id?: number
  name: string
  price: number
  quantity: number
  discount_amount: number
  tax_amount: number
  total_amount: number
}

export default function TransactionEditPage() {
  const params = useParams()
  const router = useRouter()
  const transactionId = Number(params.id)

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState<TransactionFormData>({
    outlet_id: 1,
    items: [],
    paid_amount: 0,
    payment_method: "",
    payment_reference: "",
    notes: "",
  })

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
      const transactionData = response.data as Transaction

      setTransaction(transactionData)

      // Convert transaction items to cart items
      const cartItems: CartItem[] = []
      // In a real implementation, we would fetch the actual transaction items
      // For now, we'll create some mock items based on the transaction

      // Mock cart items based on transaction amount
      const mockItem: CartItem = {
        product_id: 1,
        name: "Product",
        price: transactionData.subtotal,
        quantity: 1,
        discount_amount: transactionData.discount_amount,
        tax_amount: transactionData.tax_amount,
        total_amount: transactionData.final_amount,
      }
      cartItems.push(mockItem)

      setCart(cartItems)

      // Set form data
      setFormData({
        customer_id: transactionData.customer_id,
        outlet_id: transactionData.outlet_id,
        items: [],
        discount_amount: transactionData.discount_amount,
        tax_amount: transactionData.tax_amount,
        service_charge_amount: transactionData.service_charge_amount,
        paid_amount: transactionData.paid_amount,
        payment_method: transactionData.payment_method,
        payment_reference: transactionData.payment_reference,
        notes: transactionData.notes || "",
      })
    } catch (err) {
      setError("Failed to fetch transaction details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart]
    updatedCart.splice(index, 1)
    setCart(updatedCart)
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(index)
      return
    }

    const updatedCart = [...cart]
    updatedCart[index] = {
      ...updatedCart[index],
      quantity,
      total_amount: quantity * updatedCart[index].price,
    }
    setCart(updatedCart)
  }

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total_amount, 0)
    const discountAmount = formData.discount_amount || 0
    const taxAmount = formData.tax_amount || 0
    const serviceChargeAmount = formData.service_charge_amount || 0
    const totalAmount =
      subtotal - discountAmount + taxAmount + serviceChargeAmount

    return {
      subtotal,
      discountAmount,
      taxAmount,
      serviceChargeAmount,
      totalAmount,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      setError("Please add at least one item to the transaction")
      return
    }

    if (!formData.payment_method) {
      setError("Please select a payment method")
      return
    }

    const { totalAmount } = calculateTotals()

    if (formData.paid_amount < totalAmount) {
      setError("Paid amount must be greater than or equal to total amount")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      // Prepare transaction data
      const transactionData: TransactionFormData = {
        ...formData,
        items: cart.map((item) => ({
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
          discount_amount: item.discount_amount,
          tax_amount: item.tax_amount,
          total_amount: item.total_amount,
          notes: "",
        })),
      }

      await transactionService.updateTransaction(transactionId, transactionData)
      router.push("/dashboard/transactions")
    } catch (err) {
      setError("Failed to update transaction")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const {
    subtotal,
    discountAmount,
    taxAmount,
    serviceChargeAmount,
    totalAmount,
  } = calculateTotals()
  const changeAmount = formData.paid_amount - totalAmount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading transaction details...</div>
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Transaction"
        description={`Edit transaction ${transaction?.invoice_number}`}
        rightSlot={
          <Link href="/dashboard/transactions">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
        }
      />

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="text-red-700 p-4">{error}</div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Transaction Items
                </h3>

                {/* Cart Items */}
                {cart.length > 0 ? (
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Rp {item.price.toLocaleString("id-ID")} ×{" "}
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <div className="ml-4 w-24 text-right font-medium">
                            Rp {item.total_amount.toLocaleString("id-ID")}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                            className="text-red-500"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items in this transaction.
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Transaction Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer ID
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.customer_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_id: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outlet ID
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.outlet_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outlet_id: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Amount (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.discount_amount || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_amount: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Amount (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.tax_amount || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax_amount: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Charge (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.service_charge_amount || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_charge_amount: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge:</span>
                    <span>
                      Rp {serviceChargeAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paid Amount (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.paid_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paid_amount: Number(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                {changeAmount > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <div className="flex justify-between font-medium">
                      <span>Change:</span>
                      <span>Rp {changeAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Reference
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.payment_reference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_reference: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={submitting || cart.length === 0}
                >
                  {submitting ? "Updating..." : "Update Transaction"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
