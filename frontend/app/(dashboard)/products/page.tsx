import { productColumns } from "./columns"
import { Product } from "@/types/product"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { Plus } from "lucide-react"
import Link from "next/link"

interface ProductsPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
    category?: string
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const page = Number(searchParams.page ?? 1)
  const search = (searchParams.search ?? "").toLowerCase()
  const status = searchParams.status ?? "all"
  const category = searchParams.category ?? "all"

  // 🔥 DUMMY DATA SOURCE
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Arabica Coffee Beans",
      description: "Premium arabica coffee beans from highland plantation",
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
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
      deleted_at: null,
    },
    {
      id: 2,
      name: "Robusta Coffee Beans",
      description: "Strong and bold robusta coffee beans",
      sku: "COF-002",
      barcode: "1234567890124",
      image: null,
      price: 90000,
      cost: 60000,
      track_stock: true,
      stock_quantity: 0,
      stock_alert_threshold: 5,
      is_active: false,
      category_id: 1,
      outlet_id: 1,
      category: {
        id: 1,
        name: "Beverage",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
      deleted_at: null,
    },
    {
      id: 3,
      name: "Chocolate Croissant",
      description: "Buttery croissant with chocolate filling",
      sku: "FD-101",
      barcode: "1234567890125",
      image: null,
      price: 35000,
      cost: 20000,
      track_stock: true,
      stock_quantity: 24,
      stock_alert_threshold: 10,
      is_active: true,
      category_id: 2,
      outlet_id: 1,
      category: {
        id: 2,
        name: "Food",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:45:00.000000Z",
      deleted_at: null,
    },
  ]

  // 🔎 FILTERING (same logic as backend)
  const filtered = allProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)

    const matchStatus =
      status === "all" ||
      (status === "active" && p.is_active) ||
      (status === "inactive" && !p.is_active)

    const matchCategory = category === "all" || p.category?.name === category

    return matchSearch && matchStatus && matchCategory
  })

  // 📄 PAGINATION
  const perPage = 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)

  const items = filtered.slice((page - 1) * perPage, page * perPage)

  const meta = {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog and stock"
        rightSlot={
          <Link href="/products/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        }
      />

      <DataTable columns={productColumns} data={items} meta={meta} />
    </div>
  )
}
