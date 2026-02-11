"use client"

import { User } from "@/types/user"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Eye, Edit, Trash2, Key, UserCheck } from "lucide-react"
import Link from "next/link"

interface UserColumnsProps {
  onView?: (user: User) => void
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
  onAssignRoles?: (user: User) => void
  onResetPassword?: (user: User) => void
}

export function getUserColumns({
  onView,
  onEdit,
  onDelete,
  onAssignRoles,
  onResetPassword,
}: UserColumnsProps = {}) {
  return [
    {
      header: "Name",
      accessorKey: "name" as keyof User,
      cell: (user: User) => <div className="font-medium">{user.name}</div>,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof User,
      cell: (user: User) => <div>{user.email}</div>,
    },
    {
      header: "Username",
      accessorKey: "username" as keyof User,
      cell: (user: User) => <div>{user.username}</div>,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof User,
      cell: (user: User) => <div>{user.phone || "-"}</div>,
    },
    {
      header: "Current Outlet",
      accessorKey: "current_outlet_name" as keyof User,
      cell: (user: User) => (
        <div>{user.current_outlet_name || "Not assigned"}</div>
      ),
    },
    {
      header: "Roles",
      accessorKey: "roles" as keyof User,
      cell: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.roles?.map((role, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {role.name}
            </Badge>
          )) || <span className="text-gray-500">No roles</span>}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active" as keyof User,
      cell: (user: User) => (
        <Badge variant={user.is_active ? "default" : "secondary"}>
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Last Login",
      accessorKey: "last_login_at" as keyof User,
      cell: (user: User) => (
        <div>
          {user.last_login_at
            ? new Date(user.last_login_at).toLocaleString()
            : "Never"}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as string,
      id: "actions",
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(user)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onAssignRoles && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAssignRoles(user)}
              title="Assign Roles"
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          )}

          {onResetPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResetPassword(user)}
              title="Reset Password"
            >
              <Key className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(user)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/users/${user.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]
}
