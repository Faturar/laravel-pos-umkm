"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { roleService } from "@/lib/api/role"
import { Role, Permission } from "@/types/user"
import { ArrowLeft, Edit, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function RoleDetailPage() {
  const params = useParams()
  const roleId = params.id as string
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (roleId) {
      fetchRole()
    }
  }, [roleId])

  const fetchRole = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await roleService.getRole(parseInt(roleId))
      setRole(response.data)

      // Also fetch available permissions
      const permissionsResponse = await roleService.getAvailablePermissions()
      setPermissions(permissionsResponse.data || [])
    } catch (err) {
      setError("Failed to fetch role")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async () => {
    if (!role || !confirm("Are you sure you want to delete this role?")) {
      return
    }

    try {
      await roleService.deleteRole(role.id)
      // Redirect to roles list after successful deletion
      window.location.href = "/roles"
    } catch (err) {
      console.error("Failed to delete role:", err)
      alert("Failed to delete role")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading role details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Role not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Role: ${role.name}`}
        description="View role details and permissions"
        rightSlot={
          <div className="flex gap-2">
            <Link href={`/roles/${role.id}/permissions`}>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
            </Link>
            <Link href={`/roles/${role.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleDeleteRole}>
              Delete
            </Button>
            <Link href="/roles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Role Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{role.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span>{role.description || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={role.is_active ? "default" : "secondary"}>
                  {role.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(role.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Users:</span>
                <span className="font-medium">
                  <Users className="h-4 w-4 inline mr-1" />
                  {/* This would come from the API */}0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Permissions:</span>
                <span className="font-medium">
                  <Shield className="h-4 w-4 inline mr-1" />
                  {/* This would come from the API */}0
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {/* This would be populated with the role's permissions from the API */}
            <span className="text-gray-500">No permissions assigned</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
