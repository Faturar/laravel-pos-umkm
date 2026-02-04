import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function RolesPermissionsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="h-20 relative"></div>
        <Topbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
            <p className="text-gray-600">Kelola peran dan izin pengguna</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-500">
              Halaman roles & permissions akan segera hadir...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
