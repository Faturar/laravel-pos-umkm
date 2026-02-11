"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select"
import { Search, Eye, Calendar, User, HardDrive, Activity } from "lucide-react"

// Define TypeScript interfaces
interface AuditLog {
  id: string
  dateTime: string
  user: {
    name: string
    role: string
  }
  module: string
  action: string
  description: string
  ipAddress: string
  device: string
  beforeData?: Record<string, unknown> | null
  afterData?: Record<string, unknown> | null
  referenceId?: string
}

interface Column {
  header: string
  accessorKey: keyof AuditLog
  cell?: (row: AuditLog) => React.ReactNode
}

const AuditLogPage = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedUser, setSelectedUser] = useState("all")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [logsPerPage] = useState(10)

  // Mock users for filter
  const userOptions = [
    { value: "all", label: "All Users" },
    { value: "Admin User", label: "Admin User" },
    { value: "Staff User", label: "Staff User" },
    { value: "Finance User", label: "Finance User" },
  ]

  // Mock modules for filter
  const moduleOptions = [
    { value: "all", label: "All Modules" },
    { value: "Inventory", label: "Inventory" },
    { value: "Sales", label: "Sales" },
    { value: "Finance", label: "Finance" },
    { value: "Users", label: "Users" },
    { value: "Settings", label: "Settings" },
  ]

  // Mock action types for filter
  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "Create", label: "Create" },
    { value: "Update", label: "Update" },
    { value: "Delete", label: "Delete" },
    { value: "Login", label: "Login" },
    { value: "Logout", label: "Logout" },
    { value: "Approval", label: "Approval" },
  ]

  // Fetch audit logs from backend
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/audit-logs');
        // const data = await response.json();

        // Mock data for demonstration
        const mockLogs: AuditLog[] = [
          {
            id: "1",
            dateTime: "2023-06-15 09:30:45",
            user: { name: "Admin User", role: "Admin" },
            module: "Users",
            action: "Create",
            description: "Created new user: John Doe",
            ipAddress: "192.168.1.100",
            device: "Chrome on Windows",
            beforeData: null,
            afterData: {
              name: "John Doe",
              email: "john@example.com",
              role: "Staff",
              status: "Active",
            },
            referenceId: "user-123",
          },
          {
            id: "2",
            dateTime: "2023-06-15 10:15:22",
            user: { name: "Finance User", role: "Finance" },
            module: "Finance",
            action: "Update",
            description: "Updated payment method: Bank Transfer",
            ipAddress: "192.168.1.101",
            device: "Firefox on Windows",
            beforeData: {
              name: "Bank Transfer",
              fee: 5000,
              status: "Active",
            },
            afterData: {
              name: "Bank Transfer",
              fee: 10000,
              status: "Active",
            },
            referenceId: "payment-456",
          },
          {
            id: "3",
            dateTime: "2023-06-15 11:45:33",
            user: { name: "Staff User", role: "Staff" },
            module: "Inventory",
            action: "Delete",
            description: "Deleted product: Expired Item",
            ipAddress: "192.168.1.102",
            device: "Chrome on macOS",
            beforeData: {
              name: "Expired Item",
              sku: "EXP-001",
              quantity: 10,
            },
            afterData: null,
            referenceId: "product-789",
          },
          {
            id: "4",
            dateTime: "2023-06-15 12:00:00",
            user: { name: "Admin User", role: "Admin" },
            module: "Users",
            action: "Login",
            description: "User logged in",
            ipAddress: "192.168.1.100",
            device: "Chrome on Windows",
          },
          {
            id: "5",
            dateTime: "2023-06-15 18:30:15",
            user: { name: "Finance User", role: "Finance" },
            module: "Finance",
            action: "Approval",
            description: "Approved transaction #12345",
            ipAddress: "192.168.1.101",
            device: "Firefox on Windows",
            beforeData: {
              status: "Pending",
            },
            afterData: {
              status: "Approved",
            },
            referenceId: "transaction-12345",
          },
        ]

        setAuditLogs(mockLogs)
        setFilteredLogs(mockLogs)
      } catch (error) {
        console.error("Failed to fetch audit logs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuditLogs()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = auditLogs

    // Date range filter
    if (dateRange.start) {
      result = result.filter((log) => log.dateTime >= dateRange.start)
    }
    if (dateRange.end) {
      result = result.filter((log) => log.dateTime <= dateRange.end)
    }

    // User filter
    if (selectedUser !== "all") {
      result = result.filter((log) => log.user.name === selectedUser)
    }

    // Module filter
    if (selectedModule !== "all") {
      result = result.filter((log) => log.module === selectedModule)
    }

    // Action filter
    if (selectedAction !== "all") {
      result = result.filter((log) => log.action === selectedAction)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (log) =>
          log.description.toLowerCase().includes(term) ||
          log.user.name.toLowerCase().includes(term) ||
          log.module.toLowerCase().includes(term),
      )
    }

    setFilteredLogs(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [
    auditLogs,
    dateRange,
    selectedUser,
    selectedModule,
    selectedAction,
    searchTerm,
  ])

  // Get action badge color
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "Create":
        return "bg-green-100 text-green-800"
      case "Update":
        return "bg-blue-100 text-blue-800"
      case "Delete":
        return "bg-red-100 text-red-800"
      case "Login":
        return "bg-purple-100 text-purple-800"
      case "Logout":
        return "bg-gray-100 text-gray-800"
      case "Approval":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Open detail modal
  const openDetailModal = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Define table columns
  const columns: Column[] = [
    {
      header: "Date & Time",
      accessorKey: "dateTime",
    },
    {
      header: "User",
      accessorKey: "user",
      cell: (row: AuditLog) => (
        <div>
          <div className="font-medium">{row.user.name}</div>
          <div className="text-sm text-gray-500">{row.user.role}</div>
        </div>
      ),
    },
    {
      header: "Module",
      accessorKey: "module",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (row: AuditLog) => (
        <Badge className={getActionBadgeColor(row.action)}>{row.action}</Badge>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "IP Address",
      accessorKey: "ipAddress",
    },
    {
      header: "Device",
      accessorKey: "device",
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDetailModal(row)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600">
            Track all system activities and changes
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <Select
                  value={selectedModule}
                  onValueChange={setSelectedModule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <Select
                  value={selectedAction}
                  onValueChange={setSelectedAction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by description, user, or module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Main Table */}
        <Card className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.accessorKey)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openDetailModal(log)}
                    >
                      {columns.map((col) => (
                        <td
                          key={String(col.accessorKey)}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {col.cell
                            ? col.cell(log)
                            : String(log[col.accessorKey])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstLog + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastLog, filteredLogs.length)}
                </span>{" "}
                of <span className="font-medium">{filteredLogs.length}</span>{" "}
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
          </div>
        </Card>

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Audit Log Details"
        >
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedLog.dateTime}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedLog.user.name} ({selectedLog.user.role})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <p className="text-sm text-gray-900">{selectedLog.module}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action
                  </label>
                  <Badge className={getActionBadgeColor(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedLog.ipAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device
                  </label>
                  <p className="text-sm text-gray-900">{selectedLog.device}</p>
                </div>

                {selectedLog.referenceId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedLog.referenceId}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900">
                  {selectedLog.description}
                </p>
              </div>

              {selectedLog.beforeData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Before Data
                  </label>
                  <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.beforeData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.afterData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    After Data
                  </label>
                  <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.afterData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AuditLogPage
