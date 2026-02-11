"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { userService } from "@/lib/api/user"
import { User } from "@/types/user"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Key,
  UserCheck,
  Mail,
  Phone,
  Building,
} from "lucide-react"
import Link from "next/link"

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUser(parseInt(userId))
      setUser(response.data)
    } catch (err) {
      setError("Failed to fetch user")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!user || !confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      await userService.deleteUser(user.id)
      // Redirect to users list after successful deletion
      window.location.href = "/users"
    } catch (err) {
      console.error("Failed to delete user:", err)
      alert("Failed to delete user")
    }
  }

  const handleAssignRoles = async () => {
    if (!user) return

    try {
      const rolesResponse = await userService.getAvailableRoles()
      const availableRoles = rolesResponse.data || []

      const selectedRoles = prompt(
        "Enter role IDs (comma-separated) to assign to this user:\n\n" +
          "Available Roles:\n" +
          availableRoles
            .map(
              (role: { id: number; name: string }) =>
                `${role.id}: ${role.name}`,
            )
            .join("\n") +
          "\n\nCurrent Roles:\n" +
          (user.roles
            ?.map(
              (role: { id: number; name: string }) =>
                `${role.id}: ${role.name}`,
            )
            .join("\n") || "None"),
      )

      if (!selectedRoles) return

      const roleIds = selectedRoles
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id))

      await userService.assignRoles(user.id, roleIds)

      // Refresh the user data
      fetchUser()
      alert("Roles assigned successfully")
    } catch (err) {
      console.error("Failed to assign roles:", err)
      alert("Failed to assign roles")
    }
  }

  const handleResetPassword = async () => {
    if (!user) return

    const password = prompt("Enter new password:")
    if (!password) return

    const confirmPassword = prompt("Confirm new password:")
    if (!confirmPassword) return

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await userService.resetPassword(user.id, {
        password,
        password_confirmation: confirmPassword,
      })

      alert("Password reset successfully")
    } catch (err) {
      console.error("Failed to reset password:", err)
      alert("Failed to reset password")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading user details...</div>
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>User not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`User: ${user.name}`}
        description="View user details and manage access"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAssignRoles}>
              <UserCheck className="h-4 w-4 mr-2" />
              Assign Roles
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetPassword}>
              <Key className="h-4 w-4 mr-2" />
              Reset Password
            </Button>
            <Link href={`/users/${user.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleDeleteUser}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Access Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Outlet:</span>
                <span>{user.current_outlet_name || "Not assigned"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login:</span>
                <span>
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Roles</h3>
          <div className="flex flex-wrap gap-2">
            {user.roles?.map((role, index) => (
              <Badge key={index} variant="outline">
                {role.name}
              </Badge>
            )) || <span className="text-gray-500">No roles assigned</span>}
          </div>
        </div>
      </Card>
    </div>
  )
}
