import { cn } from "@/lib/utils"

/* ================= ROOT ================= */

const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
      bg-white
      border border-border
      rounded-card
      text-foreground
      `,
      className,
    )}
    {...props}
  />
)
Card.displayName = "Card"

/* ================= HEADER ================= */

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pt-6 pb-4 space-y-1", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

/* ================= TITLE ================= */

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-base font-semibold text-foreground", className)}
    {...props}
  />
)
CardTitle.displayName = "CardTitle"

/* ================= DESCRIPTION ================= */

const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
)
CardDescription.displayName = "CardDescription"

/* ================= CONTENT ================= */

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pb-6", className)} {...props} />
)
CardContent.displayName = "CardContent"

/* ================= FOOTER ================= */

const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("px-6 pb-6 flex items-center justify-between", className)}
    {...props}
  />
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
