import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/inventory - Get inventory data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clubSetId = searchParams.get("clubSetId")
    const locationId = searchParams.get("locationId")
    const date = searchParams.get("date")

    // If date is provided, check availability for that date
    if (date && clubSetId && locationId) {
      const availability = await prisma.availability.findUnique({
        where: {
          locationId_clubSetId_date: {
            locationId,
            clubSetId,
            date: new Date(date),
          },
        },
      })

      if (!availability) {
        // Calculate availability from inventory and bookings
        const inventory = await prisma.inventory.findFirst({
          where: {
            clubSetId,
            locationId,
          },
        })

        const bookings = await prisma.booking.count({
          where: {
            clubSetId,
            locationId,
            deliveryDate: new Date(date),
            status: {
              notIn: ["CANCELLED"],
            },
          },
        })

        const totalAvailable = inventory ? inventory.quantityTotal - bookings : 0

        return NextResponse.json({
          success: true,
          data: {
            date,
            clubSetId,
            locationId,
            morningAvailable: totalAvailable,
            afternoonAvailable: totalAvailable,
            eveningAvailable: totalAvailable,
          },
        })
      }

      return NextResponse.json({ success: true, data: availability })
    }

    // Get all inventory
    const where: any = {}
    if (clubSetId) where.clubSetId = clubSetId
    if (locationId) where.locationId = locationId

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        clubSet: true,
        location: true,
      },
    })

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    )
  }
}

// POST /api/inventory - Create or update inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { clubSetId, locationId, quantityTotal, quantityAvailable } = body

    if (!clubSetId || !locationId) {
      return NextResponse.json(
        { success: false, error: "clubSetId and locationId are required" },
        { status: 400 }
      )
    }

    // Upsert inventory
    const inventory = await prisma.inventory.upsert({
      where: {
        clubSetId_locationId: {
          clubSetId,
          locationId,
        },
      },
      update: {
        quantityTotal: quantityTotal !== undefined ? quantityTotal : undefined,
        quantityAvailable: quantityAvailable !== undefined ? quantityAvailable : undefined,
      },
      create: {
        clubSetId,
        locationId,
        quantityTotal: quantityTotal || 0,
        quantityAvailable: quantityAvailable !== undefined ? quantityAvailable : quantityTotal || 0,
        quantityReserved: 0,
      },
      include: {
        clubSet: true,
        location: true,
      },
    })

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update inventory" },
      { status: 500 }
    )
  }
}

// PATCH /api/inventory - Update inventory quantity
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Inventory ID required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const inventory = await prisma.inventory.update({
      where: { id },
      data: body,
      include: {
        clubSet: true,
        location: true,
      },
    })

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update inventory" },
      { status: 500 }
    )
  }
}
