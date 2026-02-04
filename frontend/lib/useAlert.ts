"use client"

import { useState, useCallback } from "react"

interface AlertState {
  message: string
  type: "error" | "success" | "warning" | "info"
  isVisible: boolean
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "error",
    isVisible: false,
  })

  const showAlert = useCallback(
    (
      message: string,
      type: "error" | "success" | "warning" | "info" = "error",
    ) => {
      setAlert({
        message,
        type,
        isVisible: true,
      })
    },
    [],
  )

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({
      ...prev,
      isVisible: false,
    }))
  }, [])

  const showError = useCallback(
    (message: string) => {
      showAlert(message, "error")
    },
    [showAlert],
  )

  const showSuccess = useCallback(
    (message: string) => {
      showAlert(message, "success")
    },
    [showAlert],
  )

  const showWarning = useCallback(
    (message: string) => {
      showAlert(message, "warning")
    },
    [showAlert],
  )

  const showInfo = useCallback(
    (message: string) => {
      showAlert(message, "info")
    },
    [showAlert],
  )

  return {
    alert,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }
}

export default useAlert
