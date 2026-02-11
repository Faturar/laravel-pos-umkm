"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { roleService } from "@/lib/api/role"
import { Role } from "@/types/user"
import { roleColumns } from "./columns"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await roleService.getRoles()
      setRoles(response.data || [])
    } catch (err) {
      setError("Failed to fetch roles")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (role: Role) => {
    if (!confirm("Are you sure you want to delete this role?")) {
      return
    }

    try {
      await roleService.deleteRole(role.id)
      setRoles(roles.filter((r) => r.id !== role.id))
    } catch (err) {
      console.error("Failed to delete role:", err)
      alert("Failed to delete role")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage system roles and access control"
        rightSlot={
          <Link href="/roles/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading roles...</div>
            </div>
          ) : (
            <DataTable
              columns={roleColumns}
              data={roles}
              meta={{
                page: 1,
                per_page: 10,
                total: roles.length,
                total_pages: Math.ceil(roles.length / 10),
              }}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
