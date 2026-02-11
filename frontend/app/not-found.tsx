import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-white rounded-card p-10 max-w-md w-full text-center">
        {/* Error Code */}
        <p className="text-primary font-extrabold text-9xl">404</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-button bg-primary text-white font-medium hover:bg-primary-hover transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
