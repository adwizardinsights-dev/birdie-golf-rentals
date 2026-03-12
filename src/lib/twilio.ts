import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

export const sendSMS = async ({
  to,
  body,
}: {
  to: string
  body: string
}) => {
  try {
    const message = await client.messages.create({
      body,
      from: fromPhoneNumber,
      to,
    })

    return {
      success: true,
      messageId: message.sid,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const sendBookingConfirmationSMS = async ({
  to,
  bookingNumber,
  deliveryDate,
  deliveryTime,
}: {
  to: string
  bookingNumber: string
  deliveryDate: string
  deliveryTime: string
}) => {
  const body = `Birdie Golf Rentals - Booking Confirmed! 🏌️\n\nBooking #: ${bookingNumber}\nDelivery: ${deliveryDate} at ${deliveryTime}\n\nWe'll text you when your clubs are on the way. Questions? Reply to this message or call us.`

  return sendSMS({ to, body })
}

export const sendDeliveryReminderSMS = async ({
  to,
  bookingNumber,
  deliveryTime,
}: {
  to: string
  bookingNumber: string
  deliveryTime: string
}) => {
  const body = `Birdie Golf Rentals - Delivery Tomorrow! 🏌️\n\nBooking #: ${bookingNumber}\nWe'll deliver your clubs ${deliveryTime}.\n\nPlease ensure someone is available to receive them. Reply STOP to opt out.`

  return sendSMS({ to, body })
}

export const sendOutForDeliverySMS = async ({
  to,
  bookingNumber,
  estimatedTime,
}: {
  to: string
  bookingNumber: string
  estimatedTime: string
}) => {
  const body = `Birdie Golf Rentals - Your clubs are on the way! 🚚\n\nBooking #: ${bookingNumber}\nEstimated arrival: ${estimatedTime}\n\nYour driver will call upon arrival.`

  return sendSMS({ to, body })
}

export const sendDeliveredSMS = async ({
  to,
  bookingNumber,
  returnDate,
}: {
  to: string
  bookingNumber: string
  returnDate: string
}) => {
  const body = `Birdie Golf Rentals - Delivered! ✅\n\nBooking #: ${bookingNumber}\nYour clubs have been delivered. Enjoy your round!\n\nReturn scheduled: ${returnDate}. We'll pick them up from the same location.`

  return sendSMS({ to, body })
}

export const sendReturnReminderSMS = async ({
  to,
  bookingNumber,
  returnDate,
}: {
  to: string
  bookingNumber: string
  returnDate: string
}) => {
  const body = `Birdie Golf Rentals - Return Reminder 🏌️\n\nBooking #: ${bookingNumber}\nWe'll pick up your clubs on ${returnDate}.\n\nPlease leave them at the front desk or in the designated area. Thanks for choosing Birdie!`

  return sendSMS({ to, body })
}

export default client
