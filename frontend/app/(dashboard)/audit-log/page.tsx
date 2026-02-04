import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function AuditLogPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="h-20 relative"></div>
        <Topbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-gray-600">Log aktivitas sistem</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-500">
              Halaman audit log akan segera hadir...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
