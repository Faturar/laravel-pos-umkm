import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  rightSlot?: ReactNode
}

export function PageHeader({
  title,
  description,
  rightSlot,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {rightSlot && (
        <div className="flex items-center gap-2">{rightSlot}</div>
      )}
    </div>
  )
}
