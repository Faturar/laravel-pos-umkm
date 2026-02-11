"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface InventoryDataTableProps<T> {
  columns: {
    header: string
    accessorKey: keyof T
    cell?: (row: T) => React.ReactNode
  }[]
  data: T[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  categories?: { id: number; name: string }[]
}

export function InventoryDataTable<T>({
  columns,
  data,
  meta,
  categories = [],
}: InventoryDataTableProps<T>) {
  const router = useRouter()
  const params = useSearchParams()

  function updateParam(key: string, value: string) {
    const newParams = new URLSearchParams(params.toString())
    newParams.set(key, value)
    newParams.set("page", "1") // reset page
    router.push(`?${newParams.toString()}`)
  }

  function goToPage(page: number) {
    const newParams = new URLSearchParams(params.toString())
    newParams.set("page", String(page))
    router.push(`?${newParams.toString()}`)
  }

  function updatePerPage(value: string) {
    const newParams = new URLSearchParams(params.toString())
    newParams.set("per_page", value)
    newParams.set("page", "1") // reset page
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded">
      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div className="flex gap-3">
          <div>
            <input
              placeholder="Search by name or SKU..."
              defaultValue={params.get("search") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("search", e.currentTarget.value)
                }
              }}
              className="px-4 py-2 border border-border rounded-button w-64"
            />
          </div>

          <select
            title="category"
            defaultValue={params.get("category") ?? "all"}
            onChange={(e) => updateParam("category", e.target.value)}
            className="px-4 py-2 border border-border rounded-button"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-4">
          <select
            title="low stock"
            defaultValue={params.get("low_stock") ?? "false"}
            onChange={(e) => updateParam("low_stock", e.target.value)}
            className="px-4 py-2 border border-border rounded-button"
          >
            <option value="false">All Products</option>
            <option value="true">Low Stock Only</option>
          </select>

          <select
            title="per page"
            defaultValue={params.get("per_page") ?? "10"}
            onChange={(e) => updatePerPage(e.target.value)}
            className="px-4 py-2 border border-border rounded-button"
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={`${String(col.accessorKey)}-${index}`}
                  className="px-6 py-4 text-left text-sm text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                {columns.map((col, j) => (
                  <td
                    key={`${String(col.accessorKey)}-${i}-${j}`} // new key here
                    className="px-6 py-4"
                  >
                    {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {meta.page} of {meta.total_pages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={meta.page === 1}
            onClick={() => goToPage(meta.page - 1)}
            className="px-3 py-1 border rounded-button disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={meta.page === meta.total_pages}
            onClick={() => goToPage(meta.page + 1)}
            className="px-3 py-1 border rounded-button disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
