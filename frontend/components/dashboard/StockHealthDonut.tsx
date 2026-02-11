"use client"

export function StockHealthDonut() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl font-bold text-red-600">5</div>
        <p className="text-sm text-gray-500">Critical items</p>

        <div className="mt-4 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Healthy
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Low
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Critical
          </div>
        </div>
      </div>
    </div>
  )
}
