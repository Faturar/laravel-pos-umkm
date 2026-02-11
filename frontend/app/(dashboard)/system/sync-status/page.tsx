"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { syncService } from "@/lib/api/sync"
import { SyncStatus, SyncLog } from "@/lib/api/sync"
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Database,
  Cloud,
} from "lucide-react"

// Simple date formatting function
const formatDate = (date: string): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default function SyncStatusPage() {
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
  })

  useEffect(() => {
    fetchSyncStatus()
    fetchSyncLogs()
  }, [meta.page, meta.per_page])

  const fetchSyncStatus = async () => {
    try {
      setLoading(true)
      const response = await syncService.getSyncStatus()
      setSyncStatus(response.data)
    } catch (error) {
      console.error("Error fetching sync status:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSyncLogs = async () => {
    try {
      const offset = (meta.page - 1) * meta.per_page
      const response = await syncService.getSyncLogs(meta.per_page, offset)
      setSyncLogs(response.data)
      // Update meta with total count (assuming we have this info)
      setMeta({
        ...meta,
        total: response.data.length,
        total_pages: Math.ceil(response.data.length / meta.per_page),
      })
    } catch (error) {
      console.error("Error fetching sync logs:", error)
    }
  }

  const handleSyncNow = async () => {
    try {
      setSyncing(true)
      await syncService.startSync("both")
      // Refresh status after sync
      await fetchSyncStatus()
      await fetchSyncLogs()
    } catch (error) {
      console.error("Error initiating sync:", error)
    } finally {
      setSyncing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "syncing":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="outline">Success</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "idle":
        return <Badge variant="outline">Idle</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const columns = [
    {
      header: "Time",
      accessorKey: "created_at",
      cell: (row: SyncLog) => formatDate(row.created_at),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: SyncLog) =>
        row.type.charAt(0).toUpperCase() + row.type.slice(1),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: SyncLog) => getStatusBadge(row.status),
    },
    {
      header: "Entity",
      accessorKey: "entity_type",
      cell: (row: SyncLog) => row.entity_type,
    },
    {
      header: "Entity ID",
      accessorKey: "entity_id",
      cell: (row: SyncLog) => row.entity_id,
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: (row: SyncLog) =>
        row.message ? <span className="text-sm">{row.message}</span> : "-",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sync Status"
        description="Monitor and manage data synchronization between outlets"
        rightSlot={
          <Button onClick={handleSyncNow} disabled={syncing}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
        }
      />

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Sync</p>
              <p className="text-lg font-bold">
                {syncStatus?.last_sync_at
                  ? formatDate(syncStatus.last_sync_at)
                  : "Never"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sync Status</p>
              <p className="text-lg font-bold">
                {syncStatus?.last_sync_status ? (
                  <span
                    className={`${
                      syncStatus.last_sync_status === "success"
                        ? "text-green-600"
                        : syncStatus.last_sync_status === "failed"
                          ? "text-red-600"
                          : syncStatus.last_sync_status === "in_progress"
                            ? "text-blue-600"
                            : "text-gray-600"
                    }`}
                  >
                    {syncStatus.last_sync_status.charAt(0).toUpperCase() +
                      syncStatus.last_sync_status.slice(1)}
                  </span>
                ) : (
                  "Unknown"
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cloud className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Changes</p>
              <p className="text-lg font-bold">
                {syncStatus?.pending_changes || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Uploads</p>
              <p className="text-lg font-bold">
                {syncStatus?.pending_uploads || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sync Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sync Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Last Sync Status</span>
              <div className="flex items-center gap-2">
                {syncStatus?.last_sync_status &&
                  getStatusIcon(syncStatus.last_sync_status)}
                <span className="font-medium">
                  {syncStatus?.last_sync_status
                    ? syncStatus.last_sync_status.charAt(0).toUpperCase() +
                      syncStatus.last_sync_status.slice(1)
                    : "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Changes</span>
              <span className="font-medium">
                {syncStatus?.pending_changes || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Upload</span>
              <span className="font-medium">
                {syncStatus?.last_upload_at
                  ? formatDate(syncStatus.last_upload_at)
                  : "Never"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Uploads</span>
              <span className="font-medium">
                {syncStatus?.pending_uploads || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Download</span>
              <span className="font-medium">
                {syncStatus?.last_download_at
                  ? formatDate(syncStatus.last_download_at)
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Downloads</span>
              <span className="font-medium">
                {syncStatus?.pending_downloads || 0}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Sync Logs */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sync Logs</h3>
          <Button variant="outline" size="sm" onClick={fetchSyncLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div>Loading sync logs...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={syncLogs} meta={meta} />
        )}
      </Card>
    </div>
  )
}
