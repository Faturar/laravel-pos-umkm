"use client"

interface DateRangeSelectProps {
  value?: string
  onChange?: (value: string) => void
}

export function DateRangeSelect({
  value = "today",
  onChange,
}: DateRangeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-2 border border-border rounded-button text-sm bg-white"
    >
      <option value="today">Today</option>
      <option value="yesterday">Yesterday</option>
      <option value="this_week">This Week</option>
      <option value="this_month">This Month</option>
      <option value="custom">Custom Range</option>
    </select>
  )
}
