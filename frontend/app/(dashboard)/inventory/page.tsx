import { Product } from "@/types/product"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { InventoryDataTable } from "@/components/ui/InventoryDataTable"
import { StatCard } from "@/components/dashboard/StatCard"
import { inventoryColumns } from "./columns"
import { Boxes, AlertTriangle, Package, TrendingDown } from "lucide-react"

interface InventoryPageProps {
  searchParams: {
    page?: string
    search?: string
    category?: string
    low_stock?: string
  }
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const page = Number(searchParams.page ?? 1)
  const search = (searchParams.search ?? "").toLowerCase()
  const category = searchParams.category ?? "all"
  const lowStock = searchParams.low_stock === "true"

  // 🔥 DUMMY DATA SOURCE
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Arabica Coffee Beans",
      description: "Premium arabica coffee beans from highland plantation",
      sku: "COF-001",
      barcode: "1234567890123",
      image: null,
      price: 120000,
      cost: 80000,
      track_stock: true,
      stock_quantity: 15,
      stock_alert_threshold: 5,
      is_active: true,
      category_id: 1,
      outlet_id: 1,
      category: {
        id: 1,
        name: "Beverage",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
      deleted_at: null,
    },
    {
      id: 2,
      name: "Robusta Coffee Beans",
      description: "Strong and bold robusta coffee beans",
      sku: "COF-002",
      barcode: "1234567890124",
      image: null,
      price: 90000,
      cost: 60000,
      track_stock: true,
      stock_quantity: 0,
      stock_alert_threshold: 5,
      is_active: false,
      category_id: 1,
      outlet_id: 1,
      category: {
        id: 1,
        name: "Beverage",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
      deleted_at: null,
    },
    {
      id: 3,
      name: "Chocolate Croissant",
      description: "Buttery croissant with chocolate filling",
      sku: "FD-101",
      barcode: "1234567890125",
      image: null,
      price: 35000,
      cost: 20000,
      track_stock: true,
      stock_quantity: 24,
      stock_alert_threshold: 10,
      is_active: true,
      category_id: 2,
      outlet_id: 1,
      category: {
        id: 2,
        name: "Food",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:45:00.000000Z",
      deleted_at: null,
    },
    {
      id: 4,
      name: "Green Tea Latte",
      description: "Smooth green tea with milk",
      sku: "DRK-003",
      barcode: "1234567890126",
      image: null,
      price: 45000,
      cost: 25000,
      track_stock: true,
      stock_quantity: 8,
      stock_alert_threshold: 10,
      is_active: true,
      category_id: 1,
      outlet_id: 1,
      category: {
        id: 1,
        name: "Beverage",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T13:20:00.000000Z",
      updated_at: "2024-02-05T13:20:00.000000Z",
      deleted_at: null,
    },
    {
      id: 5,
      name: "Blueberry Muffin",
      description: "Fresh blueberry muffin",
      sku: "FD-102",
      barcode: "1234567890127",
      image: null,
      price: 30000,
      cost: 15000,
      track_stock: true,
      stock_quantity: 3,
      stock_alert_threshold: 5,
      is_active: true,
      category_id: 2,
      outlet_id: 1,
      category: {
        id: 2,
        name: "Food",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T14:10:00.000000Z",
      updated_at: "2024-02-05T14:10:00.000000Z",
      deleted_at: null,
    },
    {
      id: 6,
      name: "Cappuccino",
      description: "Classic cappuccino with foam",
      sku: "COF-003",
      barcode: "1234567890128",
      image: null,
      price: 55000,
      cost: 30000,
      track_stock: true,
      stock_quantity: 20,
      stock_alert_threshold: 5,
      is_active: true,
      category_id: 1,
      outlet_id: 1,
      category: {
        id: 1,
        name: "Beverage",
      },
      outlet: {
        id: 1,
        name: "Main Outlet",
      },
      created_at: "2024-02-05T15:30:00.000000Z",
      updated_at: "2024-02-05T15:30:00.000000Z",
      deleted_at: null,
    },
  ]

  // 🔎 FILTERING
  const filtered = allProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)

    const matchCategory = category === "all" || p.category?.name === category

    const matchLowStock =
      !lowStock || p.stock_quantity <= p.stock_alert_threshold

    return matchSearch && matchCategory && matchLowStock
  })

  // 📄 PAGINATION
  const perPage = 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)

  const items = filtered.slice((page - 1) * perPage, page * perPage)

  const meta = {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  }

  // 📊 INVENTORY STATS
  const totalProducts = allProducts.length
  const activeProducts = allProducts.filter((p) => p.is_active).length
  const lowStockProducts = allProducts.filter(
    (p) => p.stock_quantity <= p.stock_alert_threshold,
  ).length
  const outOfStockProducts = allProducts.filter(
    (p) => p.stock_quantity === 0,
  ).length
  const totalStockValue = allProducts.reduce(
    (sum, p) => sum + p.stock_quantity * p.cost,
    0,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Overview"
        description="Monitor product stock levels and low stock alerts"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<Boxes className="w-8 h-8 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.toString()}
          subtitle={`${Math.round((lowStockProducts / totalProducts) * 100)}% of total`}
          subtitleColor="warning"
          icon={<AlertTriangle className="w-8 h-8 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts.toString()}
          subtitle={`${Math.round((outOfStockProducts / totalProducts) * 100)}% of total`}
          subtitleColor="error"
          icon={<TrendingDown className="w-8 h-8 text-red-600" />}
          iconBg="bg-red-100"
        />
        <StatCard
          title="Stock Value"
          value={`Rp ${totalStockValue.toLocaleString("id-ID")}`}
          subtitle="At cost price"
          subtitleColor="info"
          icon={<Package className="w-8 h-8 text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Low Stock Alert!</span> You have{" "}
                {lowStockProducts} products that need restocking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <InventoryDataTable
        columns={inventoryColumns}
        data={items}
        meta={meta}
        categories={[
          { id: 1, name: "Beverage" },
          { id: 2, name: "Food" },
        ]}
      />
    </div>
  )
}
