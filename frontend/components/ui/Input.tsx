import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        `
        w-full h-11
        rounded-button
        border border-border
        bg-white
        px-4
        text-sm text-foreground
        placeholder:text-gray-400

        focus:outline-none
        focus:border-primary
        focus:ring-1 focus:ring-primary

        disabled:opacity-60
        disabled:cursor-not-allowed

        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        `,
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
