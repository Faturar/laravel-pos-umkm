"use client"

import { useState } from "react"
import { Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { AuthSlider } from "@/components/auth/AuthSlider"

export default function RegisterPage() {
  const [showError, setShowError] = useState(false)

  return (
    <>
      {/* FORM */}
      <form
        className="max-w-sm w-full mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          setShowError(true)
        }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          Create Admin Account
        </h2>
        <p className="text-gray-500 mb-8">
          Set up your store and start managing sales
        </p>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                placeholder="admin@store.com"
                className="w-full px-4 py-3 border border-border rounded-button
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border rounded-button pr-10
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border rounded-button pr-10
                           focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button type="submit" fullWidth>
            Create Admin Account
          </Button>
        </div>
      </form>

      {/* SLIDER */}
      <AuthSlider interval={5000} />

      {/* ALERT */}
      {showError && (
        <Alert
          type="error"
          message="Passwords do not match. Please try again."
          onClose={() => setShowError(false)}
        />
      )}
    </>
  )
}
