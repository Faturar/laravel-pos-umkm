"use client"

import { useState, useEffect } from "react"
import { transactionService } from "@/services/transactionService"

const DashboardContent = () => {
  const [todayStats, setTodayStats] = useState({
    total_transactions: 0,
    total_sales: 0,
    average_transaction: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await transactionService.getStatistics()
        setTodayStats(response.data.today)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Total Transactions Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Transaksi
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {todayStats.total_transactions}
            </p>
          </div>
        </div>
      </div>

      {/* Total Sales Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Penjualan
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(todayStats.total_sales)}
            </p>
          </div>
        </div>
      </div>

      {/* Average Transaction Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Rata-rata Transaksi
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(todayStats.average_transaction)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
