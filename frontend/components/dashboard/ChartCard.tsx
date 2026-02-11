// components/dashboard/ChartCard.tsx
"use client"

import { ReactNode } from "react"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-card p-6 h-[400px] flex flex-col">
      <div className="mb-6 shrink-0">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
