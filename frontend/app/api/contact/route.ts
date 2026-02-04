import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Here you would typically:
    // 1. Send an email
    // 2. Save to a database
    // 3. Send to a third-party service

    // For demo purposes, we'll just log the data
    console.log("Contact form submission:", {
      name,
      email,
      phone: phone || "Not provided",
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: {
          name,
          email,
          subject,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 },
    )
  }
}
