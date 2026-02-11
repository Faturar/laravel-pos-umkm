"use client"

import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface CashFlowPieChartProps {
  labels?: string[]
  data?: number[]
  backgroundColors?: string[]
  title?: string
}

export default function CashFlowPieChart({
  labels = ["Category 1", "Category 2", "Category 3", "Category 4"],
  data = [30, 25, 20, 25],
  backgroundColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
  title,
}: CashFlowPieChartProps) {
  return (
    <div className="h-64">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <Pie
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right" as const,
              labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number
                  const label = context.label || ""
                  const total = context.dataset.data.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  )
                  const percentage = Math.round((value / total) * 100)
                  return `${label}: Rp ${value.toLocaleString("id-ID")} (${percentage}%)`
                },
              },
            },
          },
        }}
      />
    </div>
  )
}
