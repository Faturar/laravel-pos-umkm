"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

interface SalesLineChartProps {
  labels?: string[]
  data?: number[]
  metric?: "sales" | "transactions" | "revenue"
}

export default function SalesLineChart({
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  data = [120, 190, 300, 250, 220, 310, 400],
  metric = "sales",
}: SalesLineChartProps) {
  const metricLabel = {
    sales: "Sales",
    transactions: "Transactions",
    revenue: "Revenue",
  }[metric]

  return (
    <Line
      style={{ width: "100%", height: "100%" }}
      data={{
        labels,
        datasets: [
          {
            label: metricLabel,
            data,
            borderColor: "#2563EB", // primary blue
            backgroundColor: "rgba(37,99,235,0.08)", // subtle blue fill
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return metric === "revenue"
                  ? `Rp ${value.toLocaleString("id-ID")}`
                  : `${value}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6B7280",
              callback: (value) =>
                metric === "revenue"
                  ? `Rp ${Number(value).toLocaleString("id-ID")}`
                  : value,
            },
            grid: { color: "#F3F4F6" },
          },
          x: {
            ticks: { color: "#6B7280" },
            grid: { display: false },
          },
        },
      }}
    />
  )
}
