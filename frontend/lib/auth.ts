// Authentication service for handling login/logout

import { api } from "./api"

// React hooks for the hook function
import { useState, useEffect } from "react"

export interface User {
  id: number
  name: string
  email: string
  role?: string
  roles?: string[]
  outlet_id?: number
  current_outlet_id?: number
  status?: string
  last_login_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refresh_token?: string
  expires_in?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }
  private listeners: Array<(state: AuthState) => void> = []

  private constructor() {
    // Initialize auth state from localStorage on client side
    if (typeof window !== "undefined") {
      this.loadAuthFromStorage()
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private loadAuthFromStorage(): void {
    // Removed localStorage loading - auth data will be managed in memory only
    return
  }

  private saveAuthToStorage(token: string, user: User): void {
    // Removed localStorage saving - auth data will be managed in memory only
    return
  }

  private clearAuth(): void {
    // Clear auth state
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.authState))
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    // Immediately notify with current state
    listener(this.authState)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getState(): AuthState {
    return { ...this.authState }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    this.authState.isLoading = true
    this.notifyListeners()

    try {
      // Use the Next.js API route which will forward to the Laravel backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const responseData = await response.json()

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Login failed")
      }

      const data = responseData.data as LoginResponse

      // Set cookies for the JWT token
      if (typeof window !== "undefined") {
        const token = data.token
        const expiresInSeconds = data.expires_in || 3600

        // Set the cookie
        document.cookie = `token=${token}; path=/; max-age=${expiresInSeconds}; SameSite=Lax`

        // Log the cookie setting for debugging
        console.log("Token cookie set:", `token=${token}`)
        console.log("All cookies after login:", document.cookie)
      }

      // Update state
      this.authState = {
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      }

      this.notifyListeners()
      return data
    } catch (error) {
      this.authState.isLoading = false
      this.notifyListeners()
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout API if needed
      if (this.authState.token) {
        await api.post("/auth/logout", {})
      }
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      // Clear auth state and cookies regardless of API call success
      this.clearAuth()
      if (typeof window !== "undefined") {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict; Secure"
      }
    }
  }

  async refreshToken(): Promise<{ token: string; expires_in?: number }> {
    if (!this.authState.token) {
      throw new Error("No token available for refresh")
    }

    try {
      const response = await api.post<{ token: string; expires_in?: number }>(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${this.authState.token}`,
          },
        },
      )

      const { data } = response

      // Update token in state (localStorage removed)

      this.authState.token = data.token
      this.notifyListeners()

      return data
    } catch (error) {
      // If refresh fails, log out the user
      this.clearAuth()
      throw error
    }
  }

  updateUser(user: User): void {
    if (!user) {
      console.error("Invalid user data provided to updateUser")
      return
    }

    this.authState.user = user
    this.notifyListeners()
  }

  // Get the current authentication token
  getToken(): string | null {
    return this.authState.token
  }

  // Get the current user
  getUser(): User | null {
    return this.authState.user
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated
  }

  // Check if user has a specific role
  hasRole(role: string | string[]): boolean {
    if (!this.authState.user) {
      return false
    }

    // Get user roles from the user object
    const userRoles = this.authState.user.roles || []

    if (!userRoles || userRoles.length === 0) {
      return false
    }

    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r))
    }

    return userRoles.includes(role)
  }

  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    // This could be expanded to check user permissions
    // For now, we'll just check if user is authenticated
    return this.authState.isAuthenticated
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()

// React hook for using auth state
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize with default state for SSR
    if (typeof window === "undefined") {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    }
    return authService.getState()
  })

  useEffect(() => {
    // Only subscribe on client side
    if (typeof window !== "undefined") {
      const unsubscribe = authService.subscribe(setAuthState)
      return unsubscribe
    }
  }, [])

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    updateUser: authService.updateUser.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
  }
}
