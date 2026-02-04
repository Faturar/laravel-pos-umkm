"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { usePathname, useRouter } from "next/navigation"

interface AuthProviderProps {
  children: React.ReactNode
}

// List of public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

// Role-based routes
const kasirRoutes = ["/kasir", "/transaksi", "/payment", "/order-success"]

// Common protected routes that require authentication (accessible by all roles)
const commonProtectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/reports",
  "/transaction-history",
]

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Skip authentication check during initial loading
    if (isLoading) return

    // Check if current route is public or protected
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    )
    const isKasirRoute = kasirRoutes.some((route) =>
      pathname.startsWith(route + "/"),
    )
    const isCommonProtectedRoute = commonProtectedRoutes.some((route) =>
      pathname.startsWith(route + "/"),
    )

    // If not authenticated and trying to access a protected route, redirect to login
    if ((isKasirRoute || isCommonProtectedRoute) && !isAuthenticated) {
      const loginUrl = new URL("/login", window.location.origin)
      loginUrl.searchParams.set("redirect", pathname)
      router.push(loginUrl.toString())
      return
    }

    // If authenticated and trying to access login page, redirect to appropriate dashboard
    if (isAuthenticated && pathname === "/login") {
      if (hasRole("kasir")) {
        router.push("/kasir/dashboard")
      } else {
        // All other roles go to the common dashboard
        router.push("/dashboard")
      }
      return
    }

    // Role-based access control for protected routes
    if (isAuthenticated) {
      // Kasir routes - only kasir role can access these
      if (isKasirRoute && !hasRole("kasir")) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, hasRole])

  return <>{children}</>
}
