import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import TransactionTable from "@/components/TransactionTable"

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="h-20 relative"></div>
        <Topbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Kelola data transaksi Anda</p>
          </div>
          <TransactionTable />
        </div>
      </div>
    </div>
  )
}
