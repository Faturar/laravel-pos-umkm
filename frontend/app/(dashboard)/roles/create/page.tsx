"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { roleService } from "@/lib/api/role"
import { Permission } from "@/types/user"
import { ArrowLeft, Save, Shield } from "lucide-react"
import Link from "next/link"

export default function RoleCreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  })
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const response = await roleService.getAvailablePermissions()
      setPermissions(response.data || [])
    } catch (err) {
      console.error("Failed to fetch permissions:", err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const toggleModuleExpansion = (module: string) => {
    if (expandedModules.includes(module)) {
      setExpandedModules(expandedModules.filter((m) => m !== module))
    } else {
      setExpandedModules([...expandedModules, module])
    }
  }

  const toggleAllPermissionsInModule = (module: string, checked: boolean) => {
    const modulePermissions = permissions
      .filter((p) => p.name.split(".")[0] === module)
      .map((p) => p.id)

    if (checked) {
      setSelectedPermissions([
        ...selectedPermissions.filter((p) => !modulePermissions.includes(p)),
        ...modulePermissions,
      ])
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((p) => !modulePermissions.includes(p)),
      )
    }
  }

  const togglePermission = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== permissionId),
      )
    }
  }

  const areAllPermissionsSelected = (module: string) => {
    const modulePermissions = permissions
      .filter((p) => p.name.split(".")[0] === module)
      .map((p) => p.id)

    return modulePermissions.every((p) => selectedPermissions.includes(p))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const response = await roleService.createRole(formData)

      // Assign permissions to the newly created role
      if (selectedPermissions.length > 0) {
        await roleService.assignPermissions(
          response.data.id,
          selectedPermissions,
        )
      }

      router.push("/roles")
    } catch (err) {
      setError("Failed to create role")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by module
  const permissionGroups = permissions.reduce(
    (groups, permission) => {
      const moduleName = permission.name.split(".")[0]
      if (!groups[moduleName]) {
        groups[moduleName] = []
      }
      groups[moduleName].push(permission)
      return groups
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Role"
        description="Add a new role to the system"
        rightSlot={
          <Link href="/roles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) =>
                    handleSwitchChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active">Active Role</Label>
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold">Permissions</Label>
              <div className="mt-4 space-y-4">
                {Object.entries(permissionGroups).map(
                  ([module, modulePermissions]) => (
                    <div key={module} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{module}</h3>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`module-${module}`}
                            checked={areAllPermissionsSelected(module)}
                            onChange={(e) =>
                              toggleAllPermissionsInModule(
                                module,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <Label
                            htmlFor={`module-${module}`}
                            className="text-sm"
                          >
                            Select All
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleModuleExpansion(module)}
                          >
                            {expandedModules.includes(module)
                              ? "Collapse"
                              : "Expand"}
                          </Button>
                        </div>
                      </div>

                      {expandedModules.includes(module) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id,
                                )}
                                onChange={(e) =>
                                  togglePermission(
                                    permission.id,
                                    e.target.checked,
                                  )
                                }
                                className="h-4 w-4 text-blue-600 rounded"
                              />
                              <Label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm"
                              >
                                {permission.name.split(".")[1] ||
                                  permission.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Role"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
