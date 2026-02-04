import { NextResponse } from "next/server"

interface LaravelLoginResponse {
  success: boolean
  message: string
  data: {
    token: {
      access_token: string
      token_type: string
      expires_in: number
    }
    user: {
      id: number
      name: string
      email: string
      status: string
      last_login_at: string
      roles: string[]
      permissions: string[]
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Forward the login request to the Laravel backend using native fetch
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data: LaravelLoginResponse = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Invalid email or password",
        },
        { status: response.status },
      )
    }

    // Return the response from the Laravel backend
    return NextResponse.json(
      {
        success: true,
        message: data.message,
        data: {
          user: data.data.user,
          token: data.data.token.access_token,
          refresh_token: null, // Laravel doesn't provide refresh token in this response
          expires_in: data.data.token.expires_in,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 },
    )
  }
}
