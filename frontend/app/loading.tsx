export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-white rounded-card p-8 w-full max-w-sm">
        {/* Skeleton Header */}
        <div className="h-5 w-40 bg-gray-200 rounded mb-6 animate-pulse" />

        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-20 bg-gray-100 rounded-card animate-pulse" />
          <div className="h-20 bg-gray-100 rounded-card animate-pulse" />
        </div>

        {/* Skeleton Content */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  )
}
