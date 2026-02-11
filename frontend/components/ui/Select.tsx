"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({} as any)

/* ================= ROOT ================= */

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

/* ================= TRIGGER ================= */

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          `
          w-full h-11
          flex items-center justify-between
          rounded-button
          border border-border
          bg-white
          px-4
          text-sm text-foreground

          focus:outline-none
          focus:border-primary
          focus:ring-1 focus:ring-primary
          `,
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

/* ================= CONTENT ================= */

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = React.useContext(SelectContext)

    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          `
          absolute z-50 mt-1 w-full
          rounded-card
          border border-border
          bg-white
          shadow-lg
          overflow-hidden
          `,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
SelectContent.displayName = "SelectContent"

/* ================= ITEM ================= */

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const {
      value: selectedValue,
      onValueChange,
      setOpen,
    } = React.useContext(SelectContext)

    const isSelected = selectedValue === value

    return (
      <div
        ref={ref}
        onClick={() => {
          onValueChange?.(value)
          setOpen(false)
        }}
        className={cn(
          `
          px-4 py-2.5
          text-sm
          cursor-pointer
          transition-colors
          ${
            isSelected
              ? "bg-muted text-foreground font-medium"
              : "text-gray-600"
          }
          hover:bg-muted hover:text-foreground
          `,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
SelectItem.displayName = "SelectItem"

/* ================= VALUE ================= */

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { value } = React.useContext(SelectContext)

    return (
      <span
        ref={ref}
        className={cn(
          "truncate",
          value ? "text-foreground" : "text-gray-400",
          className,
        )}
        {...props}
      >
        {value || placeholder}
      </span>
    )
  },
)
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
