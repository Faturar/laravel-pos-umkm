export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-button" />
      </div>

      {/* Filters */}
      <div className="bg-muted rounded-card p-4 flex gap-4">
        <div className="h-10 w-64 bg-white rounded-button" />
        <div className="h-10 w-40 bg-white rounded-button" />
      </div>

      {/* Table */}
      <div className="bg-muted rounded-card pt-5 px-3 pb-3">
        <div className="bg-white rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-50">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
