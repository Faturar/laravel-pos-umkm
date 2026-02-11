"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface SalesChartProps {
  chartView: "sales" | "transactions" | "revenue"
}

export function SalesChart({ chartView }: SalesChartProps) {
  // Sample data for the last 7 days
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Sales data in IDR
  const salesData = [
    1850000, 2100000, 1950000, 2300000, 2150000, 2450000, 1900000,
  ]

  // Transaction count data
  const transactionsData = [132, 150, 139, 164, 154, 175, 136]

  // Revenue data in IDR
  const revenueData = [
    1780000, 2020000, 1870000, 2210000, 2070000, 2360000, 1830000,
  ]

  const data = {
    labels,
    datasets: [
      {
        label:
          chartView === "sales"
            ? "Sales (Rp)"
            : chartView === "transactions"
              ? "Transactions"
              : "Revenue (Rp)",
        data:
          chartView === "sales"
            ? salesData
            : chartView === "transactions"
              ? transactionsData
              : revenueData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              if (chartView === "transactions") {
                label += context.parsed.y
              } else {
                label += "Rp " + context.parsed.y.toLocaleString("id-ID")
              }
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            if (chartView === "transactions") {
              return value
            }
            return "Rp " + Number(value).toLocaleString("id-ID")
          },
        },
      },
    },
  }

  return <Line options={options} data={data} />
}
