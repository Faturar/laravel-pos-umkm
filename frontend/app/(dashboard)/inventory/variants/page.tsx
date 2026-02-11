"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { productVariantService } from "@/lib/api/productVariant"
import { ProductVariant } from "@/types/productVariant"
import { Plus } from "lucide-react"
import { getProductVariantColumns } from "./columns"
import Link from "next/link"

export default function ProductVariantsPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchVariants()
  }, [meta.page, meta.per_page])

  const fetchVariants = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await productVariantService.getProductVariants({
        page: meta.page,
        per_page: meta.per_page,
      })

      setVariants(response.data || [])
      setMeta({
        page: response.meta?.page || 1,
        per_page: response.meta?.per_page || 10,
        total: response.meta?.total || 0,
        total_pages: response.meta?.total_pages || 1,
      })
    } catch (err) {
      setError("Failed to fetch product variants")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVariant = async (variant: ProductVariant) => {
    if (!confirm("Are you sure you want to delete this product variant?")) {
      return
    }

    try {
      await productVariantService.deleteProductVariant(variant.id)
      setVariants(variants.filter((v) => v.id !== variant.id))
    } catch (err) {
      console.error("Failed to delete product variant:", err)
      alert("Failed to delete product variant")
    }
  }

  const handleAdjustStock = async (variant: ProductVariant) => {
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

      // Refresh the variants list
      fetchVariants()
      alert("Stock adjusted successfully")
    } catch (err) {
      console.error("Failed to adjust stock:", err)
      alert("Failed to adjust stock")
    }
  }

  const columns = getProductVariantColumns({
    onDelete: handleDeleteVariant,
    onAdjustStock: handleAdjustStock,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variants"
        description="Manage product variants and inventory"
        rightSlot={
          <div className="flex gap-2">
            <Link href="/inventory/variants/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </Link>
          </div>
        }
      />

      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div>Loading product variants...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <DataTable data={variants} columns={columns} meta={meta} />
        )}
      </Card>
    </div>
  )
}
