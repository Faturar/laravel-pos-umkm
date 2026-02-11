"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />

        {/* Track */}
        <div
          className={cn(
            `
            w-11 h-6
            rounded-full
            border border-border
            bg-gray-200

            transition-colors duration-200

            peer-checked:bg-primary
            peer-focus:outline-none
            peer-focus:ring-2
            peer-focus:ring-primary/30
            `,
            className,
          )}
        />

        {/* Thumb */}
        <span
          className={`
            pointer-events-none
            absolute left-[2px] top-[2px]
            h-5 w-5
            rounded-full
            bg-white
            border border-border
            transition-transform duration-200
            peer-checked:translate-x-5
          `}
        />
      </label>
    )
  },
)

Switch.displayName = "Switch"

export { Switch }
