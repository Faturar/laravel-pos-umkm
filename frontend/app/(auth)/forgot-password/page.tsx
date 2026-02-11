"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { AuthSlider } from "@/components/auth/AuthSlider"

export default function ForgotPasswordPage() {
  const [alert, setAlert] = useState<null | {
    type: "success" | "error"
    message: string
  }>(null)

  return (
    <>
      {/* FORM */}
      <form
        className="max-w-sm w-full mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          setAlert({
            type: "success",
            message: "We’ve sent a password reset link to your email address.",
          })
        }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-500 mb-8">
          Enter your email and we’ll send you a reset link
        </p>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                placeholder="admin@store.com"
                className="w-full px-4 py-3 border border-border rounded-button
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button fullWidth>Send Reset Link</Button>

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
