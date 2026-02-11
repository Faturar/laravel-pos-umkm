"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { productVariantService } from "@/lib/api/productVariant"
import { ProductVariant } from "@/types/productVariant"
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function ProductVariantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productVariantId = Number(params.id)

  const [productVariant, setProductVariant] = useState<ProductVariant | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productVariantId) {
      fetchProductVariant()
    }
  }, [productVariantId])

  const fetchProductVariant = async () => {
    try {
      setLoading(true)
      setError(null)
      const response =
        await productVariantService.getProductVariant(productVariantId)
      setProductVariant(response.data)
    } catch (err) {
      setError("Failed to fetch product variant details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = () => {
    if (!productVariant) return { text: "Unknown", variant: "outline" as const }

    if (productVariant.stock <= productVariant.min_stock) {
      return { text: "Low Stock", variant: "destructive" as const }
    } else if (productVariant.stock >= productVariant.max_stock) {
      return { text: "Overstocked", variant: "secondary" as const }
    } else {
      return { text: "In Stock", variant: "default" as const }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading product variant details...</div>
      </div>
    )
  }

  if (error || !productVariant) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-600 mb-4">
          {error || "Product variant not found"}
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const stockStatus = getStockStatus()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variant Details"
        description="View product variant information"
        rightSlot={
          <div className="flex gap-2">
            <Link
              href={`/dashboard/product-variants/${productVariant.id}/edit`}
            >
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

      {/* Product Variant Overview */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{productVariant.name}</h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                SKU: {productVariant.sku}
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <Badge
                variant={productVariant.is_active ? "default" : "secondary"}
              >
                {productVariant.is_active ? "Active" : "Inactive"}
              </Badge>{" "}
              <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Price
              </div>
              <div className="text-xl font-bold">
                Rp {productVariant.price.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                Cost
              </div>
              <div className="text-xl font-bold">
                Rp {productVariant.cost.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                Current Stock
              </div>
              <div className="text-xl font-bold">{productVariant.stock}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Stock Range
              </div>
              <div className="text-xl font-bold">
                {productVariant.min_stock} - {productVariant.max_stock}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Stock:</span>
                <span className="font-medium">{productVariant.stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Stock:</span>
                <span className="font-medium">{productVariant.min_stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maximum Stock:</span>
                <span className="font-medium">{productVariant.max_stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock Status:</span>
                <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-medium">
                  Rp {productVariant.price.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost Price:</span>
                <span className="font-medium">
                  Rp {productVariant.cost.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit Margin:</span>
                <span className="font-medium">
                  Rp{" "}
                  {(productVariant.price - productVariant.cost).toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit Percentage:</span>
                <span className="font-medium">
                  {productVariant.cost > 0
                    ? (
                        ((productVariant.price - productVariant.cost) /
                          productVariant.cost) *
                        100
                      ).toFixed(2) + "%"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Product ID:</span>
              <div className="mt-1">{productVariant.product_id}</div>
            </div>
            <div>
              <span className="text-gray-600">Created At:</span>
              <div className="mt-1">
                {new Date(productVariant.created_at).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <div className="mt-1">
                {new Date(productVariant.updated_at).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="mt-1">
                <Badge
                  variant={productVariant.is_active ? "default" : "secondary"}
                >
                  {productVariant.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
