"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { userService } from "@/lib/api/user"
import { User } from "@/types/user"
import { Plus } from "lucide-react"
import { getUserColumns } from "./columns"
import Link from "next/link"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchUsers()
  }, [meta.page, meta.per_page])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await userService.getUsers({
        page: meta.page,
        per_page: meta.per_page,
      })

      setUsers(response.data || [])
      setMeta({
        page: response.meta?.page || 1,
        per_page: response.meta?.per_page || 10,
        total: response.meta?.total || 0,
        total_pages: response.meta?.total_pages || 1,
      })
    } catch (err) {
      setError("Failed to fetch users")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      await userService.deleteUser(user.id)
      setUsers(users.filter((u) => u.id !== user.id))
    } catch (err) {
      console.error("Failed to delete user:", err)
      alert("Failed to delete user")
    }
  }

  const handleAssignRoles = async (user: User) => {
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

      // Refresh the users list
      fetchUsers()
      alert("Roles assigned successfully")
    } catch (err) {
      console.error("Failed to assign roles:", err)
      alert("Failed to assign roles")
    }
  }

  const handleResetPassword = async (user: User) => {
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

  const columns = getUserColumns({
    onDelete: handleDeleteUser,
    onAssignRoles: handleAssignRoles,
    onResetPassword: handleResetPassword,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users and access roles"
        rightSlot={
          <div className="flex gap-2">
            <Link href="/users/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </Link>
          </div>
        }
      />

      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div>Loading users...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <DataTable data={users} columns={columns} meta={meta} />
        )}
      </Card>
    </div>
  )
}
