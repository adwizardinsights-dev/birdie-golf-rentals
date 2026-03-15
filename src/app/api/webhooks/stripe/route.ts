import { NextRequest, NextResponse } from "next/server"
import { constructStripeEvent } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// POST /api/webhooks/stripe - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    let event

    try {
      event = constructStripeEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        await handlePaymentFailure(paymentIntent)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object
        await handleRefund(charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    // Update payment record
    const payment = await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: "PAID",
        stripeChargeId: paymentIntent.charges.data[0]?.id,
        paymentMethod: paymentIntent.payment_method_types[0],
        lastFour: paymentIntent.charges.data[0]?.payment_method_details?.card?.last4,
      },
      include: {
        booking: {
          include: {
            user: true,
            clubSet: true,
          },
        },
      },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        confirmedAt: new Date(),
      },
    })

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail({
        to: payment.booking.user.email,
        firstName: payment.booking.user.firstName,
        bookingNumber: payment.booking.bookingNumber,
        amount: parseFloat(payment.amount.toString()),
      })
    } catch (error) {
      console.error("Error sending payment confirmation email:", error)
    }

    console.log(`Payment succeeded: ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling payment success:", error)
    throw error
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    // Update payment record
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: "FAILED",
      },
    })

    console.log(`Payment failed: ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
    throw error
  }
}

async function handleRefund(charge: any) {
  try {
    // Find payment by charge ID
    const payment = await prisma.payment.findFirst({
      where: { stripeChargeId: charge.id },
    })

    if (payment) {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: charge.refunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
        },
      })

      // Update booking status
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: charge.refunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
        },
      })
    }

    console.log(`Refund processed: ${charge.id}`)
  } catch (error) {
    console.error("Error handling refund:", error)
    throw error
  }
}

// Placeholder for email function
async function sendPaymentConfirmationEmail({
  to,
  firstName,
  bookingNumber,
  amount,
}: {
  to: string
  firstName: string
  bookingNumber: string
  amount: number
}) {
  // Implementation would go here
  console.log(`Payment confirmation email sent to ${to}`)
}
