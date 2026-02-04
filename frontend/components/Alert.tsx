"use client"

import React, { useEffect, useState } from "react"

interface AlertProps {
  message: string
  type?: "error" | "success" | "warning" | "info"
  isVisible?: boolean
  onClose?: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "error",
  isVisible = false,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [visible, setVisible] = useState(isVisible)

  useEffect(() => {
    setVisible(isVisible)
  }, [isVisible])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (visible && autoClose) {
      timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, autoCloseTime)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [visible, autoClose, autoCloseTime, onClose])

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  if (!visible) return null

  const getAlertStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-500" // Corresponds to bg-lms-red in the original
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-red-500"
    }
  }

  return (
    <div
      className={`fixed top-10 transform -translate-x-1/2 left-1/2 z-20 flex w-150 shrink-0 rounded-full justify-between items-center py-5 px-7.5 z-50 ${getAlertStyles()}`}
    >
      <span className="font-semibold text-white">{message}</span>
      <button
        type="button"
        onClick={handleClose}
        className="flex shrink-0 text-white hover:text-gray-200 focus:outline-none"
        title="Close alert"
        aria-label="Close alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

export default Alert
