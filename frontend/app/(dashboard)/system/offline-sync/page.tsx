"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Activity,
} from "lucide-react"

// Define TypeScript interfaces
type SyncStatus = "online_synced" | "syncing" | "offline" | "error"

interface SyncData {
  status: SyncStatus
  lastSuccessfulSync: string
  pendingRecords: number
  deviceId: string
  connectionStatus: string
  pendingTransactions: number
  pendingStockMovements: number
  pendingCashLogs: number
  failedSyncAttempts: number
  errorMessage?: string
  lastFailedAttempt?: string
}

interface SyncHistory {
  id: string
  dateTime: string
  syncType: "auto" | "manual"
  status: "success" | "failed"
  recordsSynced: number
  duration: string
  error?: string
}

const OfflineSyncStatusPage = () => {
  const [syncData, setSyncData] = useState<SyncData>({
    status: "online_synced",
    lastSuccessfulSync: "2023-06-15 14:30:45",
    pendingRecords: 0,
    deviceId: "POS-DEVICE-001",
    connectionStatus: "Connected",
    pendingTransactions: 0,
    pendingStockMovements: 0,
    pendingCashLogs: 0,
    failedSyncAttempts: 0,
  })

  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([
    {
      id: "1",
      dateTime: "2023-06-15 14:30:45",
      syncType: "auto",
      status: "success",
      recordsSynced: 12,
      duration: "2.3s",
    },
    {
      id: "2",
      dateTime: "2023-06-15 12:15:22",
      syncType: "manual",
      status: "success",
      recordsSynced: 8,
      duration: "1.8s",
    },
    {
      id: "3",
      dateTime: "2023-06-15 10:45:33",
      syncType: "auto",
      status: "failed",
      recordsSynced: 0,
      duration: "5.2s",
      error: "Connection timeout",
    },
    {
      id: "4",
      dateTime: "2023-06-15 08:30:15",
      syncType: "auto",
      status: "success",
      recordsSynced: 15,
      duration: "3.1s",
    },
  ])

  const [isSyncing, setIsSyncing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [historyPerPage] = useState(5)

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch the current sync status from the backend
      // For demo purposes, we'll just simulate occasional status changes
      if (Math.random() > 0.9) {
        const statuses: SyncStatus[] = [
          "online_synced",
          "syncing",
          "offline",
          "error",
        ]
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)]

        setSyncData((prev) => ({
          ...prev,
          status: randomStatus,
          connectionStatus:
            randomStatus === "offline" ? "Disconnected" : "Connected",
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Get status icon and color
  const getStatusInfo = (status: SyncStatus) => {
    switch (status) {
      case "online_synced":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Online & Synced",
        }
      case "syncing":
        return {
          icon: RefreshCw,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          label: "Syncing",
        }
      case "offline":
        return {
          icon: WifiOff,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          label: "Offline",
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Error",
        }
      default:
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Online & Synced",
        }
    }
  }

  // Handle manual sync
  const handleManualSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    setSyncData((prev) => ({ ...prev, status: "syncing" }))

    try {
      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, this would be an API call to trigger sync
      // const response = await fetch('/api/sync/trigger', { method: 'POST' });

      // For demo, we'll randomly determine success or failure
      const success = Math.random() > 0.3

      if (success) {
        setSyncData((prev) => ({
          ...prev,
          status: "online_synced",
          lastSuccessfulSync: new Date().toLocaleString(),
          pendingRecords: 0,
          pendingTransactions: 0,
          pendingStockMovements: 0,
          pendingCashLogs: 0,
          failedSyncAttempts: 0,
          errorMessage: undefined,
          lastFailedAttempt: undefined,
        }))

        // Add to sync history
        const newHistoryItem: SyncHistory = {
          id: (syncHistory.length + 1).toString(),
          dateTime: new Date().toLocaleString(),
          syncType: "manual",
          status: "success",
          recordsSynced: Math.floor(Math.random() * 20) + 1,
          duration: `${(Math.random() * 3 + 1).toFixed(1)}s`,
        }

        setSyncHistory((prev) => [newHistoryItem, ...prev])
      } else {
        setSyncData((prev) => ({
          ...prev,
          status: "error",
          failedSyncAttempts: prev.failedSyncAttempts + 1,
          errorMessage: "Connection to server failed",
          lastFailedAttempt: new Date().toLocaleString(),
        }))

        // Add to sync history
        const newHistoryItem: SyncHistory = {
          id: (syncHistory.length + 1).toString(),
          dateTime: new Date().toLocaleString(),
          syncType: "manual",
          status: "failed",
          recordsSynced: 0,
          duration: `${(Math.random() * 5 + 2).toFixed(1)}s`,
          error: "Connection to server failed",
        }

        setSyncHistory((prev) => [newHistoryItem, ...prev])
      }
    } catch (error) {
      console.error("Sync failed:", error)
      setSyncData((prev) => ({
        ...prev,
        status: "error",
        failedSyncAttempts: prev.failedSyncAttempts + 1,
        errorMessage: "Unexpected error during sync",
        lastFailedAttempt: new Date().toLocaleString(),
      }))
    } finally {
      setIsSyncing(false)
    }
  }

  // Pagination for sync history
  const indexOfLastHistory = currentPage * historyPerPage
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage
  const currentHistory = syncHistory.slice(
    indexOfFirstHistory,
    indexOfLastHistory,
  )
  const totalPages = Math.ceil(syncHistory.length / historyPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const statusInfo = getStatusInfo(syncData.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Offline Sync Status
          </h1>
          <p className="text-gray-600">
            Monitor data synchronization and connection health
          </p>
        </div>

        {/* Sync Status Card */}
        <Card className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Sync Status
              </h2>
              <Button
                onClick={handleManualSync}
                disabled={isSyncing || syncData.status === "syncing"}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
                />
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${statusInfo.bgColor} mr-4`}>
                  <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </h3>
                  <div className="flex items-center mt-1">
                    {syncData.status === "online_synced" ? (
                      <Wifi className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-orange-600 mr-1" />
                    )}
                    <span className="text-sm text-gray-600">
                      {syncData.connectionStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Last Successful Sync
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {syncData.lastSuccessfulSync}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Records</p>
                    <p className="text-sm font-medium text-gray-900">
                      {syncData.pendingRecords}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Device ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {syncData.deviceId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Failed Attempts</p>
                    <p className="text-sm font-medium text-gray-900">
                      {syncData.failedSyncAttempts}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Error State Panel (Conditional) */}
        {syncData.status === "error" && (
          <Card className="bg-red-50 border border-red-200 rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Sync Error
                  </h3>
                  <p className="text-red-700 mb-4">
                    {syncData.errorMessage ||
                      "An error occurred during synchronization"}
                  </p>
                  {syncData.lastFailedAttempt && (
                    <p className="text-sm text-red-600 mb-4">
                      Last failed attempt: {syncData.lastFailedAttempt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-600">
                      Troubleshooting: Check your internet connection and try
                      again
                    </p>
                    <Button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
                      />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Sync Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-lg shadow-sm">
            <div className="p-5">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Pending Transactions</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {syncData.pendingTransactions}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm">
            <div className="p-5">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">
                    Pending Stock Movements
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {syncData.pendingStockMovements}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm">
            <div className="p-5">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Pending Cash Logs</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {syncData.pendingCashLogs}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm">
            <div className="p-5">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Failed Sync Attempts</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {syncData.failedSyncAttempts}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sync History Table */}
        <Card className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sync History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sync Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records Synced
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentHistory.map((history) => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {history.dateTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Badge variant="outline">
                          {history.syncType === "auto" ? "Auto" : "Manual"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          className={
                            history.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {history.status === "success" ? "Success" : "Failed"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {history.recordsSynced}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {history.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {history.error || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstHistory + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastHistory, syncHistory.length)}
                  </span>{" "}
                  of <span className="font-medium">{syncHistory.length}</span>{" "}
                  results
                </p>
                <div className="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OfflineSyncStatusPage
