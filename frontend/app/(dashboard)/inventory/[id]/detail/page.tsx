import { Product, StockMovement } from "@/types/product"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  ArrowLeft,
  Package,
  DollarSign,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface InventoryDetailPageProps {
  params: {
    id: string
  }
}

export default async function InventoryDetailPage({
  params,
}: InventoryDetailPageProps) {
  const productId = Number(params.id)

  // 🔥 DUMMY DATA SOURCE - In a real app, this would fetch from API
  const product: Product = {
    id: productId,
    name: "Arabica Coffee Beans",
    description:
      "Premium arabica coffee beans sourced from highland plantations. Perfect for espresso and drip coffee brewing.",
    sku: "COF-001",
    barcode: "1234567890123",
    image: null,
    price: 120000,
    cost: 80000,
    track_stock: true,
    stock_quantity: 15,
    stock_alert_threshold: 5,
    is_active: true,
    category_id: 1,
    outlet_id: 1,
    category: {
      id: 1,
      name: "Beverage",
      description: "All kinds of beverages",
      color: "#3B82F6",
      is_active: true,
    },
    outlet: {
      id: 1,
      name: "Main Outlet",
      code: "OUT-001",
      address: "Jl. Sudirman No. 123, Jakarta",
      phone: "021-1234567",
      email: "main@pos-umkm.com",
      is_active: true,
      tax_rate: 10,
      service_charge_rate: 5,
    },
    created_at: "2024-02-05T10:30:00.000000Z",
    updated_at: "2024-02-05T10:30:00.000000Z",
    deleted_at: null,
  }

  // Calculate stock status
  const isLowStock = product.stock_quantity <= product.stock_alert_threshold
  const isOutOfStock = product.stock_quantity === 0
  const stockValue = product.stock_quantity * product.cost

  // 🔥 DUMMY STOCK MOVEMENT DATA
  const stockMovements: StockMovement[] = [
    {
      id: 1,
      type: "in",
      quantity: 20,
      before_quantity: 0,
      after_quantity: 20,
      notes: "Initial stock input",
      product_id: productId,
      user_id: 1,
      outlet_id: 1,
      user: {
        id: 1,
        name: "Admin User",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T10:30:00.000000Z",
    },
    {
      id: 2,
      type: "out",
      quantity: 5,
      before_quantity: 20,
      after_quantity: 15,
      notes: "Sale transaction #INV-001",
      product_id: productId,
      transaction_id: 1,
      user_id: 2,
      outlet_id: 1,
      user: {
        id: 2,
        name: "Cashier User",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      transaction: {
        id: 1,
        reference_number: "INV-001",
      },
      created_at: "2024-02-06T14:20:00.000000Z",
    },
    {
      id: 3,
      type: "adjustment",
      quantity: 15,
      before_quantity: 15,
      after_quantity: 15,
      notes: "Stock count adjustment - no change needed",
      product_id: productId,
      user_id: 1,
      outlet_id: 1,
      user: {
        id: 1,
        name: "Admin User",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-10T09:15:00.000000Z",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/inventory">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
      </Link>

      <PageHeader
        title={product.name}
        description="View detailed inventory information for this product"
      />

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Stock</p>
              <p
                className={`text-2xl font-bold ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {product.stock_quantity} units
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alert Threshold</p>
              <p className="text-2xl font-bold text-gray-900">
                {product.stock_alert_threshold} units
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {stockValue.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Info className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Status</p>
              <p className="text-lg font-bold">
                {isOutOfStock ? (
                  <span className="text-red-600">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-yellow-600">Low Stock</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">SKU</span>
              <span className="font-medium">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Barcode</span>
              <span className="font-medium">{product.barcode || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Outlet</span>
              <span className="font-medium">{product.outlet?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-medium ${product.is_active ? "text-green-600" : "text-gray-500"}`}
              >
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </Card>

        {/* Pricing Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Selling Price</span>
              <span className="font-medium">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cost Price</span>
              <span className="font-medium">
                Rp {product.cost.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Profit Margin</span>
              <span className="font-medium text-green-600">
                {(
                  ((product.price - product.cost) / product.price) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Profit per Unit</span>
              <span className="font-medium text-green-600">
                Rp {(product.price - product.cost).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Track Stock</span>
              <span
                className={`font-medium ${product.track_stock ? "text-green-600" : "text-gray-500"}`}
              >
                {product.track_stock ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Current Quantity</span>
              <span
                className={`font-medium ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {product.stock_quantity} units
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Alert Threshold</span>
              <span className="font-medium">
                {product.stock_alert_threshold} units
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Buffer Stock</span>
              <span className="font-medium">
                {Math.max(
                  0,
                  product.stock_quantity - product.stock_alert_threshold,
                )}{" "}
                units
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stock Value</span>
              <span className="font-medium">
                Rp {stockValue.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium">
                {product.updated_at
                  ? new Date(product.updated_at).toLocaleDateString("id-ID")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Product Description */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {product.description || "No description available."}
        </p>
      </Card>

      {/* Stock Movement History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Movement History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Before
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  After
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockMovements.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.created_at
                      ? new Date(movement.created_at).toLocaleDateString(
                          "id-ID",
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === "in"
                          ? "bg-green-100 text-green-800"
                          : movement.type === "out"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {movement.type === "in" && (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {movement.type === "out" && (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {movement.type === "adjustment" && (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      {movement.type.charAt(0).toUpperCase() +
                        movement.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {movement.type === "out" ? "-" : "+"}
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.before_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {movement.after_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movement.notes || "-"}
                    {movement.transaction && (
                      <span className="block text-xs text-blue-600">
                        Ref: {movement.transaction.reference_number}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Variants */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  250g Pack
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  COF-001-250G
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp 35,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  8
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  500g Pack
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  COF-001-500G
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp 65,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  12
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  1kg Pack
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  COF-001-1KG
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp 120,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  3
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Low Stock
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
