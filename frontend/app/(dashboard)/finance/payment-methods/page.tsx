"use client"

import { PaymentMethod } from "@/types/payment-method"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { PaymentMethodDataTable } from "@/components/ui/PaymentMethodDataTable"
import { StatCard } from "@/components/dashboard/StatCard"
import { paymentMethodColumns } from "./columns"
import { Modal } from "@/components/ui/Modal"
import { PaymentMethodForm } from "@/components/forms/PaymentMethodForm"
import { CreditCard, DollarSign, AlertCircle, Star } from "lucide-react"
import { useState, useEffect, use } from "react"

interface PaymentMethodsPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
    type?: string
  }
}

export default function PaymentMethodsPage({
  searchParams,
}: PaymentMethodsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] =
    useState<PaymentMethod | null>(null)

  const handleAddPaymentMethod = () => {
    setEditingPaymentMethod(null)
    setIsModalOpen(true)
  }

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPaymentMethod(null)
  }

  const handleSubmitPaymentMethod = (data: Partial<PaymentMethod>) => {
    // In a real app, this would make an API call
    console.log("Saving payment method:", data)
    handleCloseModal()
  }

  // Set up event listener for edit actions
  useEffect(() => {
    const handleEditEvent = (event: CustomEvent<PaymentMethod>) => {
      handleEditPaymentMethod(event.detail)
    }

    document.addEventListener(
      "editPaymentMethod",
      handleEditEvent as EventListener,
    )

    return () => {
      document.removeEventListener(
        "editPaymentMethod",
        handleEditEvent as EventListener,
      )
    }
  }, [])
  const unwrappedSearchParams = use(searchParams)
  const page = Number(unwrappedSearchParams.page ?? 1)
  const search = (unwrappedSearchParams.search ?? "").toLowerCase()
  const status = unwrappedSearchParams.status ?? "all"
  const type = unwrappedSearchParams.type ?? "all"

  // 🔥 DUMMY DATA SOURCE
  const allPaymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: "Cash",
      type: "Cash",
      fee_type: "None",
      fee_value: 0,
      is_default: true,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T10:30:00.000000Z",
      updated_at: "2024-02-05T10:30:00.000000Z",
    },
    {
      id: 2,
      name: "QRIS",
      type: "QRIS",
      fee_type: "Percentage",
      fee_value: 0.5,
      is_default: false,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T11:15:00.000000Z",
      updated_at: "2024-02-05T11:15:00.000000Z",
    },
    {
      id: 3,
      name: "GoPay",
      type: "E-Wallet",
      fee_type: "Fixed Amount",
      fee_value: 1000,
      is_default: false,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T12:45:00.000000Z",
      updated_at: "2024-02-05T12:45:00.000000Z",
    },
    {
      id: 4,
      name: "OVO",
      type: "E-Wallet",
      fee_type: "Fixed Amount",
      fee_value: 1500,
      is_default: false,
      is_active: false,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T13:20:00.000000Z",
      updated_at: "2024-02-05T13:20:00.000000Z",
    },
    {
      id: 5,
      name: "Bank Transfer BCA",
      type: "Bank Transfer",
      fee_type: "Fixed Amount",
      fee_value: 5000,
      is_default: false,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T14:10:00.000000Z",
      updated_at: "2024-02-05T14:10:00.000000Z",
    },
    {
      id: 6,
      name: "Credit Card",
      type: "Credit Card",
      fee_type: "Percentage",
      fee_value: 2.5,
      is_default: false,
      is_active: true,
      outlet_id: 1,
      outlet: {
        id: 1,
        name: "Main Outlet",
        code: "MAIN",
      },
      created_at: "2024-02-05T15:30:00.000000Z",
      updated_at: "2024-02-05T15:30:00.000000Z",
    },
  ]

  // 🔎 FILTERING
  const filtered = allPaymentMethods.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search)

    const matchStatus =
      status === "all" ||
      (status === "active" && p.is_active) ||
      (status === "inactive" && !p.is_active)

    const matchType = type === "all" || p.type === type

    return matchSearch && matchStatus && matchType
  })

  // 📄 PAGINATION
  const perPage = 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)

  const items = filtered.slice((page - 1) * perPage, page * perPage)

  const meta = {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  }

  // 📊 PAYMENT METHOD STATS
  const activeMethods = allPaymentMethods.filter((p) => p.is_active).length
  const inactiveMethods = allPaymentMethods.filter((p) => !p.is_active).length
  const methodsWithFees = allPaymentMethods.filter(
    (p) => p.fee_type !== "None",
  ).length
  const defaultMethod = allPaymentMethods.filter((p) => p.is_default).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Methods"
        description="Manage and configure available payment options"
        rightSlot={
          <button
            onClick={handleAddPaymentMethod}
            className="px-4 py-2 bg-blue-600 text-white rounded-button hover:bg-blue-700"
          >
            Add Payment Method
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Methods"
          value={activeMethods.toString()}
          icon={<CreditCard className="w-8 h-8 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Inactive Methods"
          value={inactiveMethods.toString()}
          icon={<AlertCircle className="w-8 h-8 text-gray-600" />}
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Methods with Fees"
          value={methodsWithFees.toString()}
          icon={<DollarSign className="w-8 h-8 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Default Method"
          value={defaultMethod.toString()}
          icon={<Star className="w-8 h-8 text-blue-600" />}
          iconBg="bg-blue-100"
        />
      </div>

      {/* Payment Methods Table */}
      <PaymentMethodDataTable
        columns={paymentMethodColumns}
        data={items}
        meta={meta}
        types={[
          "Cash",
          "QRIS",
          "E-Wallet",
          "Bank Transfer",
          "Credit Card",
          "Debit Card",
        ]}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingPaymentMethod ? "Edit Payment Method" : "Add Payment Method"
        }
      >
        <PaymentMethodForm
          paymentMethod={editingPaymentMethod || undefined}
          onSubmit={handleSubmitPaymentMethod}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
