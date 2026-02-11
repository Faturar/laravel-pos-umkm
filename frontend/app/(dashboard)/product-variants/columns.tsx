"use client"

import { ProductVariant } from "@/types/productVariant"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ProductVariantColumnsProps {
  onView?: (productVariant: ProductVariant) => void
  onEdit?: (productVariant: ProductVariant) => void
  onDelete?: (productVariant: ProductVariant) => void
}

export function getProductVariantColumns({
  onView,
  onEdit,
  onDelete,
}: ProductVariantColumnsProps = {}) {
  return [
    {
      accessorKey: "id" as keyof ProductVariant,
      header: "ID",
      cell: (productVariant: ProductVariant) => (
        <div className="font-medium">{productVariant.id}</div>
      ),
    },
    {
      accessorKey: "name" as keyof ProductVariant,
      header: "Name",
      cell: (productVariant: ProductVariant) => (
        <div className="font-medium">{productVariant.name}</div>
      ),
    },
    {
      accessorKey: "sku" as keyof ProductVariant,
      header: "SKU",
      cell: (productVariant: ProductVariant) => <div>{productVariant.sku}</div>,
    },
    {
      accessorKey: "price" as keyof ProductVariant,
      header: "Price",
      cell: (productVariant: ProductVariant) => (
        <div className="font-medium">
          Rp {productVariant.price.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "stock" as keyof ProductVariant,
      header: "Stock",
      cell: (productVariant: ProductVariant) => {
        const stockLevel =
          productVariant.stock <= productVariant.min_stock
            ? "destructive"
            : productVariant.stock >= productVariant.max_stock
              ? "default"
              : "secondary"

        return (
          <div className="flex items-center gap-2">
            <span>{productVariant.stock}</span>
            <Badge variant={stockLevel}>
              {productVariant.stock <= productVariant.min_stock
                ? "Low"
                : productVariant.stock >= productVariant.max_stock
                  ? "High"
                  : "Normal"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "is_active" as keyof ProductVariant,
      header: "Status",
      cell: (productVariant: ProductVariant) => (
        <Badge variant={productVariant.is_active ? "default" : "secondary"}>
          {productVariant.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (productVariant: ProductVariant) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(productVariant)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(productVariant)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(productVariant)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/dashboard/product-variants/${productVariant.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
