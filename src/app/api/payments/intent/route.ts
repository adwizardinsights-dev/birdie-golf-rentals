import { NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// POST /api/payments/intent - Create a Stripe payment intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, amount, currency = "usd" } = body

    if (!bookingId || !amount) {
      return NextResponse.json(
        { success: false, error: "bookingId and amount are required" },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      metadata: {
        bookingId,
        bookingNumber: booking.bookingNumber,
        customerEmail: booking.user.email,
      },
    })

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: booking.userId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentId: payment.id,
      },
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
