"use client"

import { X, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/cn"
import { Button } from "./Button"

interface AlertProps {
  message: string
  type?: "error" | "success"
  onClose?: () => void
}

export function Alert({ message, type = "error", onClose }: AlertProps) {
  const isError = type === "error"

  return (
    <div
      className={cn(
        "fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[600px] max-w-[90%]",
        "flex items-center justify-between gap-4 px-6 py-4 rounded-button shadow-lg",
        isError ? "bg-error text-white" : "bg-primary text-white",
      )}
    >
      <div className="flex items-center gap-3">
        {isError ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <CheckCircle className="w-5 h-5" />
        )}
        <span className="font-semibold">{message}</span>
      </div>

      <Button
        onClick={onClose}
        className="opacity-80 hover:opacity-100 transition"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  )
}
