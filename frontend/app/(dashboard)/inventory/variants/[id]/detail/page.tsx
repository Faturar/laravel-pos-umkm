"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { productVariantService } from "@/lib/api/productVariant"
import { ProductVariant } from "@/types/productVariant"
import { ArrowLeft, Edit, Trash2, Package, DollarSign } from "lucide-react"
import Link from "next/link"

export default function ProductVariantDetailPage() {
  const params = useParams()
  const variantId = params.id as string
  const [variant, setVariant] = useState<ProductVariant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (variantId) {
      fetchVariant()
    }
  }, [variantId])

  const fetchVariant = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productVariantService.getProductVariant(
        parseInt(variantId),
      )
      setVariant(response.data)
    } catch (err) {
      setError("Failed to fetch product variant")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVariant = async () => {
    if (
      !variant ||
      !confirm("Are you sure you want to delete this product variant?")
    ) {
      return
    }

    try {
      await productVariantService.deleteProductVariant(variant.id)
      // Redirect to variants list after successful deletion
      window.location.href = "/inventory/variants"
    } catch (err) {
      console.error("Failed to delete product variant:", err)
      alert("Failed to delete product variant")
    }
  }

  const handleAdjustStock = async () => {
    if (!variant) return

    const quantity = prompt(
      "Enter stock adjustment amount (positive to add, negative to subtract):",
    )
    if (quantity === null) return

    const reason = prompt("Enter reason for stock adjustment:")
    if (!reason) return

    try {
      await productVariantService.adjustStock(variant.id, {
        quantity: parseInt(quantity),
        reason,
      })

      // Refresh the variant data
      fetchVariant()
      alert("Stock adjusted successfully")
    } catch (err) {
      console.error("Failed to adjust stock:", err)
      alert("Failed to adjust stock")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading product variant details...</div>
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

  if (!variant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Product variant not found</div>
      </div>
    )
  }

  const isLowStock = variant.stock <= variant.min_stock && variant.stock > 0
  const isOutOfStock = variant.stock === 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Product Variant: ${variant.name}`}
        description="View product variant details"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAdjustStock}>
              <Package className="h-4 w-4 mr-2" />
              Adjust Stock
            </Button>
            <Link href={`/inventory/variants/${variant.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleDeleteVariant}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Link href="/inventory/variants">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Variants
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Variant Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">SKU:</span>
                <span className="font-medium">{variant.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{variant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span>{variant.product_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={variant.is_active ? "default" : "secondary"}>
                  {variant.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(variant.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">
                  Rp {variant.price.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cost:</span>
                <span className="font-medium">
                  Rp {variant.cost.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Profit:</span>
                <span className="font-medium text-green-600">
                  Rp {(variant.price - variant.cost).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Profit Margin:</span>
                <span className="font-medium">
                  {(
                    ((variant.price - variant.cost) / variant.price) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2">
                <span
                  className={
                    isLowStock
                      ? "text-yellow-600"
                      : isOutOfStock
                        ? "text-red-600"
                        : ""
                  }
                >
                  {variant.stock}
                </span>
              </div>
              <div className="text-sm text-gray-500">Current Stock</div>
              {isLowStock && (
                <Badge
                  variant="outline"
                  className="mt-2 text-yellow-600 border-yellow-600"
                >
                  Low Stock
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive" className="mt-2">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2">{variant.min_stock}</div>
              <div className="text-sm text-gray-500">Minimum Stock</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2">
                Rp {(variant.stock * variant.price).toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-gray-500">Stock Value</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
