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

interface CashFlowLineChartProps {
  labels?: string[]
  cashInData?: number[]
  cashOutData?: number[]
}

export default function CashFlowLineChart({
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  cashInData = [1200000, 1900000, 3000000, 2500000, 2200000, 3100000, 4000000],
  cashOutData = [600000, 800000, 900000, 700000, 750000, 850000, 950000],
}: CashFlowLineChartProps) {
  return (
    <Line
      style={{ width: "100%", height: "100%" }}
      data={{
        labels,
        datasets: [
          {
            label: "Cash In",
            data: cashInData,
            borderColor: "#10B981", // green
            backgroundColor: "rgba(16, 185, 129, 0.08)", // subtle green fill
            tension: 0.35,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: "Cash Out",
            data: cashOutData,
            borderColor: "#EF4444", // red
            backgroundColor: "rgba(239, 68, 68, 0.08)", // subtle red fill
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
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                const label = context.dataset.label || ""
                return `${label}: Rp ${value.toLocaleString("id-ID")}`
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
                `Rp ${Number(value).toLocaleString("id-ID")}`,
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
