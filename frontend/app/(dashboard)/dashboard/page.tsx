import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import DashboardContent from "@/components/DashboardContent"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="h-20 relative"></div>
        <Topbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Ringkasan aktivitas bisnis Anda</p>
          </div>
          <DashboardContent />
        </div>
      </div>
    </div>
  )
}
