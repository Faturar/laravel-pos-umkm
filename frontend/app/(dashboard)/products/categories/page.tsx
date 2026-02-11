import { categoryColumns } from "./columns"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { Plus } from "lucide-react"

interface CategoriesPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
  }
}

type Category = {
  id: number
  name: string
  description?: string
  color?: string
  is_active: boolean
  outlet_id: number
  created_at: string
  updated_at: string
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const page = Number(searchParams.page ?? 1)
  const search = (searchParams.search ?? "").toLowerCase()
  const status = searchParams.status ?? "all"

  // 🔥 DUMMY DATA SOURCE
  const allCategories: Category[] = [
    {
      id: 1,
      name: "Beverage",
      description: "All kinds of drinks including coffee, tea, and juices",
      color: "#3B82F6",
      is_active: true,
      outlet_id: 1,
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
    },
    {
      id: 2,
      name: "Food",
      description: "Snacks, meals, and other food items",
      color: "#10B981",
      is_active: true,
      outlet_id: 1,
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
    },
    {
      id: 3,
      name: "Merchandise",
      description: "Branded items and merchandise",
      color: "#8B5CF6",
      is_active: false,
      outlet_id: 1,
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:50:00.000000Z",
    },
  ]

  // 🔎 FILTERING (same logic as backend)
  const filtered = allCategories.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search) ||
      (c.description && c.description.toLowerCase().includes(search))

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
        title="Categories"
        description="Manage product categories for better organization"
        rightSlot={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        }
      />

      <DataTable columns={categoryColumns} data={items} meta={meta} />
    </div>
  )
}
