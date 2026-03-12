import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateBookingNumber, calculateRentalDays } from "@/lib/utils"
import { sendBookingConfirmationEmail } from "@/lib/email"
import { sendBookingConfirmationSMS } from "@/lib/twilio"
import type { BookingInput } from "@/types"

// GET /api/bookings - Get all bookings or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (userId) {
      where.userId = userId
    }

    if (dateFrom || dateTo) {
      where.deliveryDate = {}
      if (dateFrom) {
        where.deliveryDate.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.deliveryDate.lte = new Date(dateTo)
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true,
        clubSet: true,
        location: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body: BookingInput = await request.json()

    // Validate required fields
    const requiredFields = [
      "clubSetId",
      "deliveryAddress",
      "deliveryCity",
      "deliveryState",
      "deliveryZipCode",
      "deliveryDate",
      "deliveryTimeSlot",
      "returnDate",
      "handedness",
      "numberOfSets",
    ]

    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Calculate rental days and pricing
    const rentalDays = calculateRentalDays(
      new Date(body.deliveryDate),
      new Date(body.returnDate)
    )

    // Get club set pricing
    const clubSet = await prisma.golfClubSet.findUnique({
      where: { id: body.clubSetId },
    })

    if (!clubSet) {
      return NextResponse.json(
        { success: false, error: "Club set not found" },
        { status: 404 }
      )
    }

    // Check inventory availability
    const inventory = await prisma.inventory.findFirst({
      where: {
        clubSetId: body.clubSetId,
        locationId: body.locationId,
        quantityAvailable: {
          gte: body.numberOfSets,
        },
      },
    })

    if (!inventory && body.locationId) {
      return NextResponse.json(
        { success: false, error: "Insufficient inventory for selected location" },
        { status: 400 }
      )
    }

    // Calculate pricing
    const dailyRate = parseFloat(clubSet.pricePerDay.toString())
    const subtotal = dailyRate * rentalDays * body.numberOfSets
    const deliveryFee = 0 // Could be based on location
    const deposit = parseFloat(clubSet.depositAmount.toString()) * body.numberOfSets
    const taxRate = 0.08
    const tax = subtotal * taxRate
    const total = subtotal + deliveryFee + deposit + tax

    // Create or find user
    let userId = body.userId
    if (!userId) {
      // In production, you'd create a user or use session
      // For now, we'll create a temporary user
      const user = await prisma.user.create({
        data: {
          email: "temp@example.com", // Should come from request
          firstName: "Temp",
          lastName: "User",
          role: "CUSTOMER",
        },
      })
      userId = user.id
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId,
        clubSetId: body.clubSetId,
        locationId: body.locationId,
        deliveryAddress: body.deliveryAddress,
        deliveryAddress2: body.deliveryAddress2,
        deliveryCity: body.deliveryCity,
        deliveryState: body.deliveryState,
        deliveryZipCode: body.deliveryZipCode,
        deliveryInstructions: body.deliveryInstructions,
        deliveryDate: new Date(body.deliveryDate),
        deliveryTimeSlot: body.deliveryTimeSlot,
        deliveryTime: body.deliveryTime,
        returnDate: new Date(body.returnDate),
        returnTimeSlot: body.returnTimeSlot,
        returnTime: body.returnTime,
        teeTime: body.teeTime ? new Date(body.teeTime) : null,
        golfCourseName: body.golfCourseName,
        rentalDays,
        dailyRate,
        subtotal,
        deliveryFee,
        deposit,
        tax,
        total,
        handedness: body.handedness,
        numberOfSets: body.numberOfSets,
        status: "PENDING",
        paymentStatus: "PENDING",
        deliveryStatus: "SCHEDULED",
      },
      include: {
        user: true,
        clubSet: true,
        location: true,
      },
    })

    // Update inventory if location specified
    if (inventory) {
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          quantityAvailable: {
            decrement: body.numberOfSets,
          },
          quantityReserved: {
            increment: body.numberOfSets,
          },
        },
      })
    }

    // Send confirmation notifications
    try {
      await sendBookingConfirmationEmail({
        to: booking.user.email,
        firstName: booking.user.firstName,
        bookingNumber: booking.bookingNumber,
        bookingDetails: {
          clubSetName: booking.clubSet.name,
          deliveryDate: booking.deliveryDate.toLocaleDateString(),
          deliveryTime: booking.deliveryTimeSlot,
          returnDate: booking.returnDate.toLocaleDateString(),
          deliveryAddress: booking.deliveryAddress,
          total: parseFloat(booking.total.toString()),
        },
      })

      if (booking.user.phone) {
        await sendBookingConfirmationSMS({
          to: booking.user.phone,
          bookingNumber: booking.bookingNumber,
          deliveryDate: booking.deliveryDate.toLocaleDateString(),
          deliveryTime: booking.deliveryTimeSlot,
        })
      }
    } catch (error) {
      console.error("Error sending notifications:", error)
      // Don't fail the booking if notifications fail
    }

    return NextResponse.json(
      { success: true, data: booking },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("id")

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: body,
      include: {
        user: true,
        clubSet: true,
      },
    })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
