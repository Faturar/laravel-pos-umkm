"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface MenuItemProps {
  href: string
  icon: string
  iconActive?: string
  children: React.ReactNode
}

const MenuItem = ({ href, icon, iconActive, children }: MenuItemProps) => {
  const pathname = usePathname()

  const isActive = pathname === href

  return (
    <li className="group">
      <Link
        href={href}
        className={`group flex pl-6 py-[11px] gap-3 items-center border-r-4 border-transparent ${
          isActive
            ? "bg-[linear-gradient(270deg,#EAE9FF_0%,rgba(233,232,255,0)_100%)] border-lms-purple"
            : ""
        }`}
      >
        <img
          src={isActive && iconActive ? iconActive : icon}
          className="w-6 h-6 flex shrink-0"
          alt="icon"
        />
        <span className={`${isActive ? "text-lms-purple font-semibold" : ""}`}>
          {children}
        </span>
      </Link>
    </li>
  )
}

const Sidebar = () => {
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <aside className="flex flex-col w-[250px] shrink-0 h-auto">
      <div className="fixed top-0 z-50 flex flex-col w-[250px] shrink-0 h-screen overflow-hidden overflow-y-scroll bg-white border-r border-lms-grey py-[50px] hide-scrollbar">
        <div className="flex w-[60px] h-[60px] shrink-0 rounded-full bg-lms-purple items-center justify-center overflow-hidden mx-auto font-['Inter']">
          <span className="font-bold text-[34px] leading-[41] text-white">
            B
          </span>
        </div>
        <div className="flex flex-col gap-0.5 justify-center px-8 w-full text-center mt-4">
          <p className="font-semibold text-xl leading-[30px]">POS UMKM</p>
          <p className="text-sm leading-[21px] text-lms-text-secondary">
            {user ? `Welcome, ${user.name}` : "Not logged in"}
          </p>
        </div>

        {/* KASIR Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            KASIR
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem href="/dashboard/kasir" icon="/kasir.svg">
              Kasir
            </MenuItem>
            <MenuItem href="/dashboard/payment" icon="/payment.svg">
              Payment
            </MenuItem>
            <MenuItem href="/dashboard/order-success" icon="/receipt.svg">
              Order Success / Receipt
            </MenuItem>
            <MenuItem href="/dashboard/transaction-history" icon="/history.svg">
              Transaction History
            </MenuItem>
          </ul>
        </nav>

        {/* ADMIN / OWNER Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            ADMIN / OWNER
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem
              href="/dashboard"
              icon="/dashboard.svg"
              iconActive="/dashboard-purple.svg"
            >
              Dashboard
            </MenuItem>
            <MenuItem
              href="/dashboard/transactions"
              icon="/transactions.svg"
              iconActive="/transactions-purple.svg"
            >
              Transactions
            </MenuItem>
            <MenuItem href="/dashboard/reports" icon="/reports.svg">
              Reports
            </MenuItem>
          </ul>
        </nav>

        {/* PRODUK & INVENTORI Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            PRODUK & INVENTORI
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem href="/dashboard/categories" icon="/categories.svg">
              Categories
            </MenuItem>
            <MenuItem
              href="/dashboard/products"
              icon="/products.svg"
              iconActive="/products-purple.svg"
            >
              Products
            </MenuItem>
            <MenuItem href="/dashboard/combo-package" icon="/combo.svg">
              Combo / Package
            </MenuItem>
            <MenuItem
              href="/dashboard/inventory-overview"
              icon="/inventory.svg"
            >
              Inventory Overview
            </MenuItem>
            <MenuItem href="/dashboard/stock-movement" icon="/stock.svg">
              Stock Movement
            </MenuItem>
          </ul>
        </nav>

        {/* KEUANGAN Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            KEUANGAN
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem
              href="/dashboard/payment-methods"
              icon="/payment-methods.svg"
            >
              Payment Methods
            </MenuItem>
            <MenuItem href="/dashboard/cash-flow" icon="/cash-flow.svg">
              Cash Flow
            </MenuItem>
          </ul>
        </nav>

        {/* USER & SETTINGS Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            USER & SETTINGS
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem href="/dashboard/users" icon="/users.svg">
              Users
            </MenuItem>
            <MenuItem href="/dashboard/roles-permissions" icon="/roles.svg">
              Roles & Permissions
            </MenuItem>
            <MenuItem href="/dashboard/store-settings" icon="/settings.svg">
              Store Settings
            </MenuItem>
          </ul>
        </nav>

        {/* SYSTEM Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            SYSTEM
          </p>
          <ul className="flex flex-col gap-[10px]">
            <MenuItem href="/dashboard/audit-log" icon="/audit.svg">
              Audit Log
            </MenuItem>
            <MenuItem href="/dashboard/offline-sync-status" icon="/sync.svg">
              Offline Sync Status
            </MenuItem>
          </ul>
        </nav>

        {/* OTHERS Section */}
        <nav className="flex flex-col gap-[10px] mt-[30px]">
          <p className="text-xs leading-[18px] text-lms-text-secondary ml-6">
            OTHERS
          </p>
          <ul className="flex flex-col gap-[10px]">
            <li className="group">
              <button
                onClick={handleLogout}
                className="group flex pl-6 py-[11px] gap-3 items-center border-r-4 border-transparent group-[&.active]:bg-[linear-gradient(270deg,#EAE9FF_0%,rgba(233,232,255,0)_100%)] group-[&.active]:border-lms-purple w-full text-left"
              >
                <img
                  src="/logout.svg"
                  className="w-6 h-6 flex shrink-0 group-[&.active]:hidden"
                  alt="icon"
                />
                <span className="group-[&.active]:text-lms-purple group-[&.active]:font-semibold">
                  Sign Out
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
