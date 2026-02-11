import { Menu, Search, Bell } from "lucide-react"

interface HeaderProps {
  title?: string
  onToggleSidebar?: () => void
  onOpenSearch?: () => void
  notificationCount?: number
}

export function Header({
  title = "Logistics Overview",
  onToggleSidebar,
  onOpenSearch,
  notificationCount = 0,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-end w-full h-[90px] shrink-0 border-b border-border bg-white px-5 md:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden size-11 flex items-center justify-center rounded-xl ring-1 ring-border hover:ring-primary transition-all duration-300"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-6 text-foreground" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="size-11 flex items-center justify-center rounded-xl ring-1 ring-border hover:ring-primary transition-all duration-300"
          aria-label="Search"
        >
          <Search className="size-6 text-gray-500" />
        </button>

        {/* Notifications */}
        <button
          className="size-11 flex items-center justify-center rounded-xl ring-1 ring-border hover:ring-primary transition-all duration-300 relative"
          aria-label="Notifications"
        >
          <Bell className="size-6 text-gray-500" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 px-1.5 rounded-full bg-error text-white text-xs font-medium flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right leading-tight">
            <p className="font-semibold text-foreground text-sm">Alex Morgan</p>
            <p className="text-gray-500 text-xs">Operations Manager</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            alt="Profile"
            className="size-11 rounded-full object-cover ring-2 ring-border"
          />
        </div>
      </div>
    </header>
  )
}
