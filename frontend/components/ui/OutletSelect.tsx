"use client"

interface Outlet {
  id: number | string
  name: string
}

interface OutletSelectProps {
  outlets?: Outlet[]
  value?: string
  onChange?: (value: string) => void
}

export function OutletSelect({
  outlets = [
    { id: "all", name: "All Outlets" },
    { id: "1", name: "Main Outlet" },
    { id: "2", name: "Branch A" },
  ],
  value = "all",
  onChange,
}: OutletSelectProps) {
  return (
    <select
      title="outlet"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-2 border border-border rounded-button text-sm bg-white"
    >
      {outlets.map((outlet) => (
        <option key={outlet.id} value={String(outlet.id)}>
          {outlet.name}
        </option>
      ))}
    </select>
  )
}
