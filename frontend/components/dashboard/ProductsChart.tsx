"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ProductComboData {
  name: string
  type: string
  quantity: number
  revenue: number
}

interface ProductsChartProps {
  data: ProductComboData[]
  chartType: "products" | "combos"
  dataType: "quantity" | "revenue"
}

export function ProductsChart({
  data,
  chartType,
  dataType,
}: ProductsChartProps) {
  // Filter data based on chart type
  const filteredData = data
    .filter((item) =>
      chartType === "products"
        ? item.type === "Product"
        : item.type === "Combo",
    )
    .slice(0, 5) // Show top 5 items

  const labels = filteredData.map((item) => item.name)
  const chartData = filteredData.map((item) =>
    dataType === "quantity" ? item.quantity : item.revenue,
  )

  const dataConfig = {
    labels,
    datasets: [
      {
        label: dataType === "quantity" ? "Quantity Sold" : "Revenue (Rp)",
        data: chartData,
        backgroundColor:
          chartType === "products"
            ? "rgba(59, 130, 246, 0.8)"
            : "rgba(16, 185, 129, 0.8)",
        borderColor:
          chartType === "products" ? "rgb(59, 130, 246)" : "rgb(16, 185, 129)",
        borderWidth: 1,
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
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              if (dataType === "quantity") {
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
            if (dataType === "quantity") {
              return value
            }
            return "Rp " + Number(value).toLocaleString("id-ID")
          },
        },
      },
    },
  }

  return <Bar options={options} data={dataConfig} />
}
