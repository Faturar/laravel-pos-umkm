"use client"

import Link from "next/link"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/Card"
import {
  BarChart3,
  Package,
  CreditCard,
  Wallet,
  TrendingUp,
} from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      title: "Sales Report",
      description: "Sales performance and transaction trends",
      href: "/reports/sales",
      icon: BarChart3,
      iconBg: "bg-accent-teal",
    },
    {
      title: "Product & Combo Report",
      description: "Best selling products and combos",
      href: "/reports/products",
      icon: Package,
      iconBg: "bg-accent-peach",
    },
    {
      title: "Payment Method Report",
      description: "Payment breakdown and trends",
      href: "/reports/payments",
      icon: CreditCard,
      iconBg: "bg-accent-lime",
    },
    {
      title: "Cash Flow Report",
      description: "Cash in, cash out, and net cash",
      href: "/reports/cash-flow",
      icon: Wallet,
      iconBg: "bg-muted",
    },
    {
      title: "Stock Movement Report",
      description: "Inventory changes and stock activity over time",
      href: "/reports/stock-movement",
      icon: TrendingUp,
      iconBg: "bg-accent-blue",
    },
  ]

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Reports"
        description="Business performance & analysis"
      />

      {/* ================= REPORT CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon

          return (
            <Link key={report.title} href={report.href} className="h-full">
              <div
                className="group bg-white rounded-card p-6 h-full
               flex flex-col gap-4
               transition-all
               hover:bg-primary hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-icon flex items-center justify-center
                  transition-colors
                  ${report.iconBg}
                  group-hover:bg-white/20`}
                >
                  <Icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-white">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80">
                    {report.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
