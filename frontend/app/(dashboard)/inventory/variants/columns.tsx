"use client"

import { ProductVariant } from "@/types/productVariant"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

interface ProductVariantColumnsProps {
  onView?: (variant: ProductVariant) => void
  onEdit?: (variant: ProductVariant) => void
  onDelete?: (variant: ProductVariant) => void
  onAdjustStock?: (variant: ProductVariant) => void
}

export function getProductVariantColumns({
  onView,
  onEdit,
  onDelete,
  onAdjustStock,
}: ProductVariantColumnsProps = {}) {
  return [
    {
      header: "SKU",
      accessorKey: "sku" as keyof ProductVariant,
      cell: (variant: ProductVariant) => (
        <div className="font-medium">{variant.sku}</div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name" as keyof ProductVariant,
      cell: (variant: ProductVariant) => (
        <div className="font-medium">{variant.name}</div>
      ),
    },
    {
      header: "Product",
      accessorKey: "product_name" as keyof ProductVariant,
      cell: (variant: ProductVariant) => (
        <div>{variant.product_name || "-"}</div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price" as keyof ProductVariant,
      cell: (variant: ProductVariant) => (
        <div>Rp {variant.price.toLocaleString("id-ID")}</div>
      ),
    },
    {
      header: "Stock",
      accessorKey: "stock" as keyof ProductVariant,
      cell: (variant: ProductVariant) => {
        const isLowStock =
          variant.stock <= variant.min_stock && variant.stock > 0
        const isOutOfStock = variant.stock === 0

        return (
          <div>
            <span
              className={`font-medium ${isLowStock ? "text-yellow-600" : isOutOfStock ? "text-red-600" : ""}`}
            >
              {variant.stock}
            </span>
            {isLowStock && (
              <Badge
                variant="outline"
                className="ml-2 text-yellow-600 border-yellow-600"
              >
                Low
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="ml-2">
                Out of Stock
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      header: "Min Stock",
      accessorKey: "min_stock" as keyof ProductVariant,
      cell: (variant: ProductVariant) => <div>{variant.min_stock}</div>,
    },
    {
      header: "Status",
      accessorKey: "is_active" as keyof ProductVariant,
      cell: (variant: ProductVariant) => (
        <Badge variant={variant.is_active ? "default" : "secondary"}>
          {variant.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as string,
      id: "actions",
      cell: (variant: ProductVariant) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(variant)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(variant)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onAdjustStock && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAdjustStock(variant)}
              title="Adjust Stock"
            >
              <Package className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(variant)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/inventory/variants/${variant.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
