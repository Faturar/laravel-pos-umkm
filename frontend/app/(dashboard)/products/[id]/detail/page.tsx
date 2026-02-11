import Image from "next/image"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import { Edit, Box, AlertTriangle } from "lucide-react"

export default function ProductDetailPage() {
  const product = {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan ayam, telur, dan bumbu spesial",
    price: 25000,
    cost: 15000,
    sku: "NG-001",
    barcode: "8991234567890",
    image: "https://images.unsplash.com/photo-1604908177522-432bdf6ddc66?w=500",
    is_active: true,
    track_stock: true,
    stock_quantity: 8,
    stock_alert_threshold: 10,
    category: "Food",
    outlet: "Main Outlet",
  }

  const isLowStock =
    product.track_stock &&
    product.stock_quantity <= product.stock_alert_threshold

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Product Detail"
        description="View product information & stock"
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="primary">Adjust Stock</Button>
          </div>
        }
      />

      {/* ================= MAIN INFO ================= */}
      <section className="bg-white rounded-card border border-border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="relative w-full h-56 rounded-card overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">
              {product.name}
            </h2>

            {product.is_active ? (
              <span className="text-green-600 text-sm font-medium">Active</span>
            ) : (
              <span className="text-gray-400 text-sm">Inactive</span>
            )}
          </div>

          <p className="text-gray-500">{product.description}</p>

          {/* Price */}
          <div className="grid grid-cols-2 gap-6">
            <InfoBlock
              label="Price"
              value={`Rp ${product.price.toLocaleString("id-ID")}`}
              strong
            />
            <InfoBlock
              label="Cost"
              value={`Rp ${product.cost.toLocaleString("id-ID")}`}
            />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <Meta label="SKU" value={product.sku} />
            <Meta label="Barcode" value={product.barcode} />
            <Meta label="Category" value={product.category} />
            <Meta label="Outlet" value={product.outlet} />
          </div>
        </div>
      </section>

      {/* ================= STOCK ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">
            Stock Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox
            label="Track Stock"
            value={product.track_stock ? "Yes" : "No"}
          />
          <StatBox
            label="Stock Quantity"
            value={product.stock_quantity.toString()}
          />
          <StatBox
            label="Alert Threshold"
            value={product.stock_alert_threshold.toString()}
          />
        </div>

        {isLowStock && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-card">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Low stock — needs attention</span>
          </div>
        )}
      </section>
    </div>
  )
}

/* ================= SUB COMPONENTS ================= */

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-foreground truncate">{value}</p>
    </div>
  )
}

function InfoBlock({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`${
          strong ? "text-xl font-bold" : "text-lg font-semibold"
        } text-foreground`}
      >
        {value}
      </p>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-card p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
