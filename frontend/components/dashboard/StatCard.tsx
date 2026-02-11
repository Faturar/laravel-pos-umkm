import { ReactNode } from "react"

type SubtitleColor = "success" | "info" | "warning" | "error"

interface StatCardProps {
  title: string
  value: string
  unit?: string
  subtitle?: string
  subtitleColor?: SubtitleColor
  icon?: ReactNode
  iconBg?: string
}

const subtitleColorMap: Record<SubtitleColor, string> = {
  success: "text-green-600",
  info: "text-blue-600",
  warning: "text-yellow-600",
  error: "text-red-600",
}

export function StatCard({
  title,
  value,
  unit,
  subtitle,
  subtitleColor = "info",
  icon,
  iconBg = "bg-muted",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-card p-6 space-y-4">
      {/* Title */}
      <h3 className="text-foreground text-lg font-bold">{title}</h3>

      {/* Inner Card */}
      <div className="bg-white rounded-card">
        <div className="flex items-center justify-between gap-4">
          {/* Value */}
          <div>
            <p className="text-foreground text-3xl font-extrabold leading-none mb-2">
              {value}
              {unit && (
                <span className="text-base font-normal text-gray-500 ml-1">
                  {unit}
                </span>
              )}
            </p>

            {subtitle && (
              <p
                className={`text-sm font-medium ${
                  subtitleColorMap[subtitleColor]
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div
              className={`w-16 h-16 rounded-icon flex items-center justify-center shrink-0 ${iconBg} rounded-md`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
