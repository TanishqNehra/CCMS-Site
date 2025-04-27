import { NextResponse } from "next/server"
import { consignments } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let filteredConsignments = consignments

    if (status) {
      filteredConsignments = consignments.filter((c) => c.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredConsignments,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, this would create a new consignment in the database
    // For now, we'll just return a success response

    return NextResponse.json({
      success: true,
      message: "Consignment created successfully",
      data: {
        id: `CCM${Math.floor(Math.random() * 10000000)}`,
        ...body,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
