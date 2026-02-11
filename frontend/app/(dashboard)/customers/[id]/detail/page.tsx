"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { Customer } from "@/lib/api/customer"
import { customerService } from "@/lib/api/customer"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await customerService.getCustomer(customerId)
      setCustomer(response.data)
    } catch (error) {
      console.error("Error fetching customer:", error)
      router.push("/dashboard/customers")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading customer data...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Customer not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Details"
        description="View customer information"
        rightSlot={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/customers/${customer.id}/edit`)
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/customers")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        }
      />

      {/* Customer Information */}
      <Card>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Customer since{" "}
                {new Date(customer.created_at).toLocaleDateString()}
              </div>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>

              {customer.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{customer.email}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div>{customer.phone}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>

              {customer.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div>{customer.address}</div>
                    {(customer.city ||
                      customer.province ||
                      customer.postal_code) && (
                      <div className="text-gray-600">
                        {customer.city && `${customer.city}`}
                        {customer.city && customer.province && ", "}
                        {customer.province && `${customer.province}`}
                        {customer.postal_code && ` ${customer.postal_code}`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">
              Total Orders
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">No order history</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Total Spent</div>
            <div className="text-2xl font-bold">Rp 0</div>
            <div className="text-sm text-gray-500">No purchase history</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Last Order</div>
            <div className="text-2xl font-bold">-</div>
            <div className="text-sm text-gray-500">No previous orders</div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              No order history found
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
