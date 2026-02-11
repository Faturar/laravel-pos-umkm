"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { getProductVariantColumns } from "./columns"
import { productVariantService } from "@/lib/api/productVariant"
import { ProductVariant } from "@/types/productVariant"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function ProductVariantsPage() {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProductVariants()
  }, [])

  const fetchProductVariants = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productVariantService.getProductVariants()
      setProductVariants(response.data || [])
    } catch (err) {
      setError("Failed to fetch product variants")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProductVariant = (productVariant: ProductVariant) => {
    // This will be implemented when we create the detail page
    console.log("View product variant:", productVariant)
  }

  const handleEditProductVariant = (productVariant: ProductVariant) => {
    // This will be implemented when we create the edit page
    console.log("Edit product variant:", productVariant)
  }

  const handleDeleteProductVariant = async (productVariant: ProductVariant) => {
    if (!confirm("Are you sure you want to delete this product variant?")) {
      return
    }

    try {
      await productVariantService.deleteProductVariant(productVariant.id)
      fetchProductVariants() // Refresh the list
    } catch (err) {
      console.error("Failed to delete product variant:", err)
      alert("Failed to delete product variant")
    }
  }

  const columns = getProductVariantColumns({
    onView: handleViewProductVariant,
    onEdit: handleEditProductVariant,
    onDelete: handleDeleteProductVariant,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Variants"
        description="Manage and view all product variants"
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
            <Link href="/dashboard/product-variants/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Product Variant
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
          data={productVariants}
          meta={{
            page: 1,
            per_page: 10,
            total: productVariants.length,
            total_pages: Math.ceil(productVariants.length / 10),
          }}
        />
      </Card>
    </div>
  )
}
