import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Helper: decode JWT payload (base64url)
function b64urlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  try {
    return atob(base64)
  } catch {
    return ""
  }
}

// Helper: get JWT token from request
function getToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("token")?.value ||
    request.cookies.get("jwt_token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "")
  )
}

// Helper: check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  const token = getToken(request)
  return !!token
}

// Helper: get user roles from JWT token
function getUserRoles(request: NextRequest): string[] {
  const token = getToken(request)

  if (!token) {
    return []
  }

  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return []
    }

    const payload = parts[1]
    const decodedPayload = b64urlDecode(payload)
    const json = JSON.parse(decodedPayload || "{}")

    // Try to get roles from different possible locations in the token
    if (json.roles && Array.isArray(json.roles)) {
      return json.roles
    }

    if (json.user && json.user.roles && Array.isArray(json.user.roles)) {
      return json.user.roles
    }

    return []
  } catch (error) {
    console.error("Error decoding JWT token:", error)
    return []
  }
}

// Helper: check if user has a specific role
function hasRole(request: NextRequest, role: string): boolean {
  const roles = getUserRoles(request)
  return roles.includes(role)
}

// Helper: check if user has any of the specified roles
function hasAnyRole(request: NextRequest, roles: string[]): boolean {
  const userRoles = getUserRoles(request)
  return roles.some((role) => userRoles.includes(role))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define path categories
  const publicPaths = ["/", "/login", "/register", "/forgot-password"]
  const authPaths = ["/login", "/register", "/forgot-password"]

  // Role-based paths
  const kasirPaths = ["/kasir", "/transaksi", "/payment", "/order-success"]

  // Common protected paths that require authentication (accessible by all roles)
  const commonProtectedPaths = [
    "/dashboard",
    "/profile",
    "/settings",
    "/reports",
    "/transaction-history",
  ]

  // Check if current path matches any category
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  )
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  )
  const isKasirPath = kasirPaths.some((path) => pathname.startsWith(path + "/"))
  const isCommonProtectedPath = commonProtectedPaths.some((path) =>
    pathname.startsWith(path + "/"),
  )

  const authenticated = isAuthenticated(request)

  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !authenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If the path is login/register and user is already authenticated, redirect to dashboard
  if (isAuthPath && authenticated) {
    // Redirect to appropriate dashboard based on user role
    const roles = getUserRoles(request)

    if (roles.includes("kasir")) {
      return NextResponse.redirect(new URL("/kasir/dashboard", request.url))
    } else {
      // All other roles (admin, manager, hrd, finance, staff, report_viewer) use the common dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Role-based access control for protected paths
  if (authenticated) {
    // Kasir paths (only kasir role can access these paths)
    if (isKasirPath && !hasRole(request, "kasir")) {
      const unauthorizedUrl = new URL("/unauthorized", request.url)
      unauthorizedUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(unauthorizedUrl)
    }

    // Common protected paths (accessible by all authenticated users)
    if (isCommonProtectedPath && !authenticated) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add CORS headers for API routes
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    )

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }

    return response
  }

  // For all other requests, continue
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - public (public files)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|public|sitemap.xml|robots.txt).*)",
  ],
}
