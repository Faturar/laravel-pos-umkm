import { comboColumns } from "./columns"
import { Combo } from "@/types/combo"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { Plus } from "lucide-react"
import Link from "next/link"

interface CombosPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
  }
}

export default async function CombosPage({ searchParams }: CombosPageProps) {
  const page = Number(searchParams.page ?? 1)
  const search = (searchParams.search ?? "").toLowerCase()
  const status = searchParams.status ?? "all"

  // 🔥 DUMMY DATA SOURCE
  const allCombos: Combo[] = [
    {
      id: 1,
      name: "Coffee & Croissant Combo",
      price: 145000,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      items: [
        {
          id: 1,
          combo_id: 1,
          product_id: 1,
          product: {
            id: 1,
            name: "Arabica Coffee Beans",
            sku: "COF-001",
            price: 120000,
            cost: 80000,
            stock: 15,
          },
          qty: 1,
        },
        {
          id: 2,
          combo_id: 1,
          product_id: 3,
          product: {
            id: 3,
            name: "Chocolate Croissant",
            sku: "FD-101",
            price: 35000,
            cost: 20000,
            stock: 24,
          },
          qty: 1,
        },
      ],
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
    },
    {
      id: 2,
      name: "Breakfast Special",
      price: 85000,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      items: [
        {
          id: 3,
          combo_id: 2,
          product_id: 2,
          product: {
            id: 2,
            name: "Robusta Coffee Beans",
            sku: "COF-002",
            price: 90000,
            cost: 60000,
            stock: 0,
          },
          qty: 1,
        },
        {
          id: 4,
          combo_id: 2,
          product_id: 3,
          product: {
            id: 3,
            name: "Chocolate Croissant",
            sku: "FD-101",
            price: 35000,
            cost: 20000,
            stock: 24,
          },
          qty: 1,
        },
      ],
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
    },
    {
      id: 3,
      name: "Coffee Lover's Package",
      price: 200000,
      is_active: false,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      items: [
        {
          id: 5,
          combo_id: 3,
          product_id: 1,
          product: {
            id: 1,
            name: "Arabica Coffee Beans",
            sku: "COF-001",
            price: 120000,
            cost: 80000,
            stock: 15,
          },
          qty: 1,
        },
        {
          id: 6,
          combo_id: 3,
          product_id: 2,
          product: {
            id: 2,
            name: "Robusta Coffee Beans",
            sku: "COF-002",
            price: 90000,
            cost: 60000,
            stock: 0,
          },
          qty: 1,
        },
        {
          id: 7,
          combo_id: 3,
          product_id: 3,
          product: {
            id: 3,
            name: "Chocolate Croissant",
            sku: "FD-101",
            price: 35000,
            cost: 20000,
            stock: 24,
          },
          qty: 2,
        },
      ],
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:45:00.000000Z",
    },
  ]

  // 🔎 FILTERING (same logic as backend)
  const filtered = allCombos.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search)

    const matchStatus =
      status === "all" ||
      (status === "active" && c.is_active) ||
      (status === "inactive" && !c.is_active)

    return matchSearch && matchStatus
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
        title="Combos"
        description="Manage your product combinations and packages"
        rightSlot={
          <Link href="/combos/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Combo
            </Button>
          </Link>
        }
      />

      <DataTable columns={comboColumns} data={items} meta={meta} />
    </div>
  )
}
