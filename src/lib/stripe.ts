import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
}

export const createPaymentIntent = async ({
  amount,
  currency = 'usd',
  metadata = {},
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.confirm(paymentIntentId)
}

export const createRefund = async ({
  paymentIntentId,
  amount,
}: {
  paymentIntentId: string
  amount?: number
}) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  })

  return refund
}

export const constructStripeEvent = (
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) => {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
