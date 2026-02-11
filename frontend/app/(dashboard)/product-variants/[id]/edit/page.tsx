"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { productVariantService } from "@/lib/api/productVariant"
import { ProductVariant, ProductVariantFormData } from "@/types/productVariant"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  is_active: boolean
}

export default function ProductVariantEditPage() {
  const params = useParams()
  const router = useRouter()
  const productVariantId = Number(params.id)

  const [productVariant, setProductVariant] = useState<ProductVariant | null>(
    null,
  )
  const [formData, setFormData] = useState<ProductVariantFormData>({
    product_id: 0,
    name: "",
    sku: "",
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 0,
    max_stock: 100,
    is_active: true,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productVariantId) {
      fetchProductVariant()
      fetchProducts()
    }
  }, [productVariantId])

  const fetchProductVariant = async () => {
    try {
      setLoading(true)
      setError(null)
      const response =
        await productVariantService.getProductVariant(productVariantId)
      const variantData = response.data as ProductVariant
      setProductVariant(variantData)

      // Set form data
      setFormData({
        product_id: variantData.product_id,
        name: variantData.name,
        sku: variantData.sku,
        price: variantData.price,
        cost: variantData.cost,
        stock: variantData.stock,
        min_stock: variantData.min_stock,
        max_stock: variantData.max_stock,
        is_active: variantData.is_active,
      })
    } catch (err) {
      setError("Failed to fetch product variant details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      // In a real implementation, this would be an actual API call
      // For now, we'll use mock data
      const mockProducts: Product[] = [
        { id: 1, name: "Nasi Goreng", is_active: true },
        { id: 2, name: "Mie Ayam", is_active: true },
        { id: 3, name: "Es Teh", is_active: true },
      ]

      setProducts(mockProducts)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_id) {
      setError("Please select a product")
      return
    }

    if (!formData.name.trim()) {
      setError("Variant name is required")
      return
    }

    if (!formData.sku.trim()) {
      setError("SKU is required")
      return
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0")
      return
    }

    if (formData.stock < 0) {
      setError("Stock cannot be negative")
      return
    }

    if (formData.min_stock < 0) {
      setError("Minimum stock cannot be negative")
      return
    }

    if (formData.max_stock <= formData.min_stock) {
      setError("Maximum stock must be greater than minimum stock")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await productVariantService.updateProductVariant(
        productVariantId,
        formData,
      )
      router.push("/dashboard/product-variants")
    } catch (err) {
      setError("Failed to update product variant")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "product_id" ||
          name.includes("stock") ||
          name.includes("price") ||
          name.includes("cost")
            ? Number(value)
            : value,
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading product variant details...</div>
      </div>
    )
  }

  if (error && !productVariant) {
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
        title="Edit Product Variant"
        description={`Edit variant: ${productVariant?.name || ""}`}
        rightSlot={
          <Link href="/dashboard/product-variants">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product Variants
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
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Variant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  name="product_id"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  required
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Large, Small, Spicy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. NASI-LRG"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rp) *
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (Rp)
                </label>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  name="min_stock"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.min_stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Stock *
                </label>
                <input
                  type="number"
                  name="max_stock"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.max_stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Product Variant"}
          </Button>
        </div>
      </form>
    </div>
  )
}
