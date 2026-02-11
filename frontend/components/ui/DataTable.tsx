"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface DataTableProps<T> {
  columns: {
    header: string
    accessorKey: keyof T | string
    id?: string
    cell?: (row: T) => React.ReactNode
  }[]
  data: T[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  customFilters?: React.ReactNode
}

export function DataTable<T>({
  columns,
  data,
  meta,
  customFilters,
}: DataTableProps<T>) {
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
        <div>
          <input
            placeholder="Search..."
            defaultValue={params.get("search") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("search", e.currentTarget.value)
              }
            }}
            className="px-4 py-2 border border-border rounded-button w-64"
          />
        </div>

        <div className="space-x-4">
          {customFilters}
          <select
            title="status"
            defaultValue={params.get("status") ?? "all"}
            onChange={(e) => updateParam("status", e.target.value)}
            className="px-4 py-2 border border-border rounded-button"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="voided">Voided</option>
            <option value="refunded">Refunded</option>
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
                  key={col.id || `col-${index}`}
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
                {columns.map((col, index) => (
                  <td key={col.id || `col-${index}`} className="px-6 py-4">
                    {col.cell
                      ? col.cell(row)
                      : typeof col.accessorKey === "string"
                        ? null
                        : String(row[col.accessorKey as keyof T])}
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
