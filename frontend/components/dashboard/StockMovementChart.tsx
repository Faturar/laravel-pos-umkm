"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

interface StockMovementChartProps {
  data: {
    date: string
    stockIn: number
    stockOut: number
  }[]
}

export default function StockMovementChart({ data }: StockMovementChartProps) {
  return (
    <Line
      style={{ width: "100%", height: "100%" }}
      data={{
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "Stock In",
            data: data.map((item) => item.stockIn),
            borderColor: "#10B981", // green
            backgroundColor: "rgba(16, 185, 129, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: "Stock Out",
            data: data.map((item) => item.stockOut),
            borderColor: "#EF4444", // red
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            tension: 0.35,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top" as const,
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `${context.dataset.label}: ${value}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6B7280",
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
