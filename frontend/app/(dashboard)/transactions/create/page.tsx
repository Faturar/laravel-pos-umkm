"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { transactionService } from "@/lib/api/transaction"
import { TransactionFormData } from "@/types/transaction"
import { ArrowLeft, Plus, Minus, Search } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  variants?: ProductVariant[]
}

interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: number
  stock: number
}

interface Customer {
  id: number
  name: string
  email?: string
  phone: string
}

interface PaymentMethod {
  id: number
  name: string
  is_active: boolean
}

interface Outlet {
  id: number
  name: string
  is_active: boolean
}

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

export default function TransactionCreatePage() {
  const router = useRouter()

  const [formData, setFormData] = useState<TransactionFormData>({
    outlet_id: 1, // Default outlet
    items: [],
    paid_amount: 0,
    payment_method: "",
    payment_reference: "",
    notes: "",
  })

  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real implementation, these would be actual API calls
      // For now, we'll use mock data

      // Mock products
      const mockProducts: Product[] = [
        { id: 1, name: "Nasi Goreng", price: 25000, stock: 50 },
        { id: 2, name: "Mie Ayam", price: 20000, stock: 30 },
        { id: 3, name: "Es Teh", price: 5000, stock: 100 },
      ]

      // Mock customers
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "08123456789",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "08987654321",
        },
      ]

      // Mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        { id: 1, name: "Cash", is_active: true },
        { id: 2, name: "Credit Card", is_active: true },
        { id: 3, name: "E-Wallet", is_active: true },
      ]

      // Mock outlets
      const mockOutlets: Outlet[] = [
        { id: 1, name: "Main Store", is_active: true },
        { id: 2, name: "Branch 1", is_active: true },
      ]

      setProducts(mockProducts)
      setCustomers(mockCustomers)
      setPaymentMethods(mockPaymentMethods)
      setOutlets(mockOutlets)

      // Set default outlet
      if (mockOutlets.length > 0) {
        setFormData((prev) => ({ ...prev, outlet_id: mockOutlets[0].id }))
      }
    } catch (err) {
      setError("Failed to load initial data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product, variant?: ProductVariant) => {
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.product_id === product.id &&
        (variant
          ? item.product_variant_id === variant.id
          : !item.product_variant_id),
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedCart = [...cart]
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        total_amount:
          (updatedCart[existingItemIndex].quantity + 1) *
          updatedCart[existingItemIndex].price,
      }
      setCart(updatedCart)
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product_id: product.id,
        product_variant_id: variant?.id,
        name: variant ? `${product.name} - ${variant.name}` : product.name,
        price: variant ? variant.price : product.price,
        quantity: 1,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: variant ? variant.price : product.price,
      }
      setCart([...cart, newItem])
    }

    setShowProductSearch(false)
    setSearchTerm("")
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

      await transactionService.createTransaction(transactionData)
      router.push("/dashboard/transactions")
    } catch (err) {
      setError("Failed to create transaction")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Transaction"
        description="Add a new transaction"
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
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Products</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowProductSearch(!showProductSearch)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {showProductSearch && (
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {filteredProducts.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => addToCart(product)}
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Rp {product.price.toLocaleString("id-ID")} |
                                  Stock: {product.stock}
                                </div>
                              </div>
                              <Button type="button" size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
                    No products added. Click &quot;Add Product&quot; to start.
                  </div>
                )}
              </div>
            </Card>

            {/* Transaction Details */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Transaction Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <select
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
                    >
                      <option value="">Select a customer (optional)</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outlet
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.outlet_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outlet_id: Number(e.target.value),
                        })
                      }
                    >
                      {outlets.map((outlet) => (
                        <option key={outlet.id} value={outlet.id}>
                          {outlet.name}
                        </option>
                      ))}
                    </select>
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
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.name}>
                          {method.name}
                        </option>
                      ))}
                    </select>
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
                    Payment Reference (optional)
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
                  {submitting ? "Processing..." : "Complete Transaction"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
