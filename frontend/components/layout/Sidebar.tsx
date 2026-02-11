"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  Boxes,
  Tags,
  Users,
  Settings,
  Wallet,
  ShieldCheck,
  Database,
  X,
  Store,
  Package,
} from "lucide-react"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

/* ===== DATA TETAP, TIDAK DIUBAH ===== */
const menu = [
  {
    title: "Admin / Owner",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Transactions", href: "/transactions", icon: Receipt },
      { label: "Reports", href: "/reports", icon: Database },
    ],
  },
  {
    title: "Produk & Inventori",
    items: [
      { label: "Categories", href: "/products/categories", icon: Tags },
      { label: "Products", href: "/products", icon: Boxes },
      { label: "Combos", href: "/combos", icon: Package },
      { label: "Inventory", href: "/inventory", icon: Database },
    ],
  },
  {
    title: "Keuangan",
    items: [
      { label: "Payment Methods", href: "/finance/payments", icon: Wallet },
      { label: "Cash Flow", href: "/finance/cashflow", icon: Wallet },
    ],
  },
  {
    title: "User & Settings",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Roles", href: "/roles", icon: ShieldCheck },
      { label: "Store Settings", href: "/settings", icon: Settings },
    ],
  },
]

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-[280px] h-screen
        bg-white border-r border-border
        flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between h-[90px] px-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-16 h-14 bg-primary rounded-xl flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          {/* <span className="text-xl font-semibold">POSify</span> */}
        </div>

        <button
          onClick={onClose}
          className="lg:hidden size-11 rounded-xl ring-1 ring-border hover:ring-primary transition"
        >
          <X className="size-6 text-gray-500 mx-auto" />
        </button>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 overflow-y-auto p-5 space-y-6">
        {menu.map((section) => (
          <div key={section.title} className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex items-center gap-3
                      px-4 py-3 rounded-xl transition
                      ${
                        active
                          ? "bg-primary text-white font-semibold"
                          : "hover:text-gray-500 hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        size-5 transition
                        ${
                          active
                            ? "text-white"
                            : "group-hover:text-gray-400 text-foreground"
                        }
                      `}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
