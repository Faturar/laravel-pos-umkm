"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/Badge"
import { customerService } from "@/lib/api/customer"
import { Customer } from "@/lib/api/customer"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchCustomers()
  }, [meta.page, searchTerm])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerService.getCustomers({
        page: meta.page,
        per_page: meta.per_page,
        search: searchTerm,
      })
      setCustomers(response.data)
      setMeta(response.meta)
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.deleteCustomer(id)
        fetchCustomers()
      } catch (error) {
        console.error("Error deleting customer:", error)
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (row: Customer) => <div className="font-medium">{row.name}</div>,
    },
    {
      header: "Contact",
      accessorKey: "contact",
      cell: (row: Customer) => (
        <div className="space-y-1">
          {row.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-1 text-gray-500" />
              {row.email}
            </div>
          )}
          {row.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 mr-1 text-gray-500" />
              {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: (row: Customer) => (
        <div className="text-sm">
          {row.address && <div>{row.address}</div>}
          {row.city && row.province && (
            <div className="text-gray-500">
              {row.city}, {row.province}
              {row.postal_code && ` ${row.postal_code}`}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/customers/${row.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer information"
        rightSlot={
          <Button onClick={() => router.push("/dashboard/customers/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        }
      />

      {/* Search Bar */}
      <Card>
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading customers...</div>
            </div>
          ) : (
            <DataTable columns={columns} data={customers} meta={meta} />
          )}
        </div>
      </Card>
    </div>
  )
}
