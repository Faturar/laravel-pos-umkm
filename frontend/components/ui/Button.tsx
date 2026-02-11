import { forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "outline" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-transparent " +
  "disabled:opacity-50 disabled:cursor-not-allowed"

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",

  outline:
    "border border-border text-foreground hover:border-primary hover:text-primary",

  ghost: "text-foreground hover:bg-gray-100 active:bg-gray-200",

  danger: "bg-red-500 text-white hover:bg-red-600",
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      fullWidth = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"
