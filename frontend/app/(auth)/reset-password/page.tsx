"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { AuthSlider } from "@/components/auth/AuthSlider"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [alert, setAlert] = useState<null | {
    type: "success" | "error"
    message: string
  }>(null)

  if (!token) {
    return (
      <Alert
        type="error"
        message="Invalid or expired reset link."
        onClose={() => {}}
      />
    )
  }

  return (
    <>
      {/* FORM */}
      <form
        className="max-w-sm w-full mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          setAlert({
            type: "success",
            message:
              "Your password has been reset successfully. You can now sign in.",
          })
        }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-8">
          Create a new password for your account
        </p>

        <div className="space-y-5">
          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-border rounded-button pr-10
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-border rounded-button pr-10
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button fullWidth>Reset Password</Button>

          <a
            href="/login"
            className="block text-center text-sm text-gray-500 hover:text-primary"
          >
            Back to Sign In
          </a>
        </div>
      </form>

      {/* SLIDER */}
      <AuthSlider interval={5000} />

      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  )
}
