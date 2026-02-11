"use client"

import { useState } from "react"

import { Lock } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { AuthSlider } from "@/components/auth/AuthSlider"
import { Alert } from "@/components/ui/Alert"

export default function LoginPage() {
  const [alert, setAlert] = useState<null | {
    type: "success" | "error"
    message: string
  }>(null)
  return (
    <>
      {/* FORM */}
      <form className="max-w-sm w-full mx-auto">
        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          Sign in to your POS
        </h2>
        <p className="text-gray-500 mb-8">
          Manage sales, products, and transactions in real time
        </p>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              placeholder="cashier@store.com"
              className="mt-1 w-full px-4 py-3 border border-border rounded-button
                         focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

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

          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-border" />
              Remember this device
            </label>
            <a
              href="/forgot-password"
              className="text-primary font-medium hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" fullWidth>
            Enter POS
          </Button>
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
