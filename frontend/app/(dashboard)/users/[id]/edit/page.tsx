"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { userService } from "@/lib/api/user"
import { outletService } from "@/lib/api/outlet"
import { UserUpdateFormData } from "@/types/user"
import { Outlet } from "@/types/outlet"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function UserEditPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [formData, setFormData] = useState<UserUpdateFormData>({
    name: "",
    email: "",
    username: "",
    phone: "",
    is_active: true,
    current_outlet_id: undefined,
    role_ids: [],
  })
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUser()
      fetchOutlets()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUser(parseInt(userId))
      const user = response.data

      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone || "",
        is_active: user.is_active,
        current_outlet_id: user.current_outlet_id,
        role_ids: user.roles?.map((role: { id: number }) => role.id) || [],
      })
    } catch (err) {
      setError("Failed to fetch user")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutlets = async () => {
    try {
      const response = await outletService.getOutlets()
      setOutlets(response.data || [])
    } catch (err) {
      console.error("Failed to fetch outlets:", err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : undefined,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      await userService.updateUser(parseInt(userId), formData)
      router.push("/users")
    } catch (err) {
      setError("Failed to update user")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        description="Update user information"
        rightSlot={
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_outlet_id">Default Outlet</Label>
                <Select
                  value={formData.current_outlet_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleSelectChange("current_outlet_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet.id} value={outlet.id.toString()}>
                        {outlet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) =>
                    handleSwitchChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active">Active User</Label>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
