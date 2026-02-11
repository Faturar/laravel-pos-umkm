import { Combo } from "@/types/combo"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, Edit, Package } from "lucide-react"
import Link from "next/link"

interface ComboDetailPageProps {
  params: {
    id: string
  }
}

// Mock data - in a real app, this would come from an API call
const mockCombo: Combo = {
  id: 1,
  name: "Coffee & Croissant Combo",
  price: 145000,
  is_active: true,
  outlet_id: 1,
  outlet: {
    id: 1,
    name: "Main Outlet",
  },
  items: [
    {
      id: 1,
      combo_id: 1,
      product_id: 1,
      product: {
        id: 1,
        name: "Arabica Coffee Beans",
        sku: "COF-001",
        price: 120000,
        cost: 80000,
        stock: 15,
      },
      qty: 1,
    },
    {
      id: 2,
      combo_id: 1,
      product_id: 3,
      product: {
        id: 3,
        name: "Chocolate Croissant",
        sku: "FD-101",
        price: 35000,
        cost: 20000,
        stock: 24,
      },
      qty: 1,
    },
  ],
  created_at: "2024-02-05T10:30:00.000000Z",
  updated_at: "2024-02-05T10:30:00.000000Z",
}

export default function ComboDetailPage({ params }: ComboDetailPageProps) {
  const comboId = parseInt(params.id)

  // In a real app, we would fetch the combo data based on the ID
  const combo = mockCombo

  return (
    <div className="space-y-6">
      <PageHeader
        title="Combo Details"
        description="View combo information and composition"
        rightSlot={
          <div className="flex gap-2">
            <Link href={`/combos/${comboId}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href="/combos">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Combos
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Combo Information */}
        <Card>
          <CardHeader>
            <CardTitle>Combo Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold">{combo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="text-lg font-semibold">Rp {combo.price}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-semibold">
                {combo.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    Inactive
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Outlet</p>
              <p className="text-lg font-semibold">
                {combo.outlet?.name || "All Outlets"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sales Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-lg font-semibold">42</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-lg font-semibold">Rp 6,090,000</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-lg font-semibold">
                {new Date(combo.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-lg font-semibold">
                {new Date(combo.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combo Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Combo Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {combo.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    SKU: {item.product.sku}
                  </p>
                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      Variant: {item.variant.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">Qty: {item.qty}</p>
                  <p className="text-sm text-gray-500">
                    Rp {item.product.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
