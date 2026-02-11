import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        `
        w-full min-h-24
        rounded-button
        border border-border
        bg-white
        px-4 py-3
        text-sm text-foreground
        placeholder:text-gray-400
        resize-none

        focus:outline-none
        focus:border-primary
        focus:ring-1 focus:ring-primary

        disabled:opacity-60
        disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
