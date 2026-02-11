"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/forms/ProductForm"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function EditProductPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect back to products list after successful creation
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        description="Add a new product to your inventory"
        rightSlot={
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        }
      />

      <div className="mx-auto">
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
