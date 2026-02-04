"use client"

import React, { createContext, useContext, ReactNode } from "react"
import Alert from "./Alert"
import useAlert from "../lib/useAlert"

interface AlertContextType {
  showAlert: (
    message: string,
    type?: "error" | "success" | "warning" | "info",
  ) => void
  hideAlert: () => void
  showError: (message: string) => void
  showSuccess: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const {
    alert,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  } = useAlert()

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
        showError,
        showSuccess,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  )
}

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider")
  }
  return context
}

export default AlertProvider
