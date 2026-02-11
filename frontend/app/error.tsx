"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-white rounded-card p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-icon bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          We encountered an unexpected error while loading this page.
        </p>

        {/* Action */}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-button bg-primary text-white font-medium hover:bg-primary-hover transition"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  )
}
