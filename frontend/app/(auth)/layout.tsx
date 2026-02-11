import { Store } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans min-h-screen bg-muted">
      <div className="flex min-h-screen">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[520px] flex flex-col justify-between px-8 lg:px-12 py-10 bg-white">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">POSify</h1>
              <p className="text-sm text-gray-500">Point of Sale System</p>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 flex items-center">{children}</div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center">
            © 2026 POSify. All rights reserved.
          </p>
        </div>

        {/* RIGHT PANEL SLOT (page controls visibility) */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden">
          {/* this area is controlled by page.tsx */}
        </div>
      </div>
    </div>
  )
}
