import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // In a real app, this would validate credentials against a database
    if (email === "admin@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        user: {
          email,
          name: "Admin User",
          role: "ADMIN",
        },
        token: "mock-jwt-token",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
