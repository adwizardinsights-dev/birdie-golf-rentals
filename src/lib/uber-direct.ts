import type { UberDirectEstimate } from '@/types'

const UBER_DIRECT_API_URL = process.env.UBER_DIRECT_API_URL || 'https://api.uber.com/v1/deliveries'
const UBER_DIRECT_CLIENT_ID = process.env.UBER_DIRECT_CLIENT_ID || ''
const UBER_DIRECT_CLIENT_SECRET = process.env.UBER_DIRECT_CLIENT_SECRET || ''

interface UberDirectQuoteRequest {
  pickup_address: string
  pickup_latitude: number
  pickup_longitude: number
  dropoff_address: string
  dropoff_latitude: number
  dropoff_longitude: number
}

interface UberDirectQuoteResponse {
  kind: string
  id: string
  created: string
  expires: string
  fee: number
  currency: string
  dropoff_eta: number
  duration: number
}

// Get access token for Uber Direct API
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://login.uber.com/oauth/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: UBER_DIRECT_CLIENT_ID,
      client_secret: UBER_DIRECT_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'delivery',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get Uber Direct access token')
  }

  const data = await response.json()
  return data.access_token
}

// Get delivery quote from Uber Direct
export async function getDeliveryQuote(
  pickupLat: number,
  pickupLng: number,
  pickupAddress: string,
  dropoffLat: number,
  dropoffLng: number,
  dropoffAddress: string
): Promise<UberDirectEstimate> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${UBER_DIRECT_API_URL}/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickup_address: pickupAddress,
        pickup_latitude: pickupLat,
        pickup_longitude: pickupLng,
        dropoff_address: dropoffAddress,
        dropoff_latitude: dropoffLat,
        dropoff_longitude: dropoffLng,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get delivery quote')
    }

    const data: UberDirectQuoteResponse = await response.json()

    return {
      deliveryFee: data.fee,
      pickupFee: data.fee, // Same fee for pickup
      deliveryEta: data.dropoff_eta,
      pickupEta: data.duration,
      currency: data.currency,
    }
  } catch (error) {
    console.error('Uber Direct API error:', error)
    // Return mock data for development/testing
    return getMockDeliveryEstimate()
  }
}

// Calculate delivery time based on tee time
export function calculateDeliveryTime(
  teeTime: Date,
  uberEtaMinutes: number,
  bufferMinutes: number = 15
): Date {
  const deliveryTime = new Date(teeTime.getTime())
  const totalMinutesToSubtract = uberEtaMinutes + bufferMinutes
  deliveryTime.setMinutes(deliveryTime.getMinutes() - totalMinutesToSubtract)
  return deliveryTime
}

// Mock delivery estimate for development
export function getMockDeliveryEstimate(): UberDirectEstimate {
  return {
    deliveryFee: 18.50,
    pickupFee: 18.50,
    deliveryEta: 25, // 25 minutes
    pickupEta: 25,
    currency: 'USD',
  }
}

// Format delivery time for display
export function formatDeliveryTimeMessage(
  deliveryTime: Date,
  teeTime: Date
): string {
  const deliveryTimeStr = deliveryTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  
  const teeTimeStr = teeTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return `Your clubs will arrive at ${deliveryTimeStr} before your ${teeTimeStr} tee time.`
}
