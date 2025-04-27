import { NextResponse } from "next/server"
import { trucks } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let filteredTrucks = trucks

    if (status) {
      filteredTrucks = trucks.filter((t) => t.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredTrucks,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, this would create a new truck in the database
    // For now, we'll just return a success response

    return NextResponse.json({
      success: true,
      message: "Truck added successfully",
      data: {
        id: `TRK-${Math.floor(Math.random() * 1000)}`,
        ...body,
        status: "available",
        lastMaintenance: new Date().toISOString().split("T")[0],
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
