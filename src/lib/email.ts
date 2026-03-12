import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'bookings@birdiegolfrentals.com'

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Birdie Golf Rentals <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const sendBookingConfirmationEmail = async ({
  to,
  firstName,
  bookingNumber,
  bookingDetails,
}: {
  to: string
  firstName: string
  bookingNumber: string
  bookingDetails: {
    clubSetName: string
    deliveryDate: string
    deliveryTime: string
    returnDate: string
    deliveryAddress: string
    total: number
  }
}) => {
  const subject = `Booking Confirmed - ${bookingNumber}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2D5A3D; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .button { background: #2D5A3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! 🏌️</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          <p>Your golf club rental is confirmed. Here are your booking details:</p>
          
          <div class="detail-row">
            <strong>Booking Number:</strong>
            <span>${bookingNumber}</span>
          </div>
          <div class="detail-row">
            <strong>Club Set:</strong>
            <span>${bookingDetails.clubSetName}</span>
          </div>
          <div class="detail-row">
            <strong>Delivery Date:</strong>
            <span>${bookingDetails.deliveryDate}</span>
          </div>
          <div class="detail-row">
            <strong>Delivery Time:</strong>
            <span>${bookingDetails.deliveryTime}</span>
          </div>
          <div class="detail-row">
            <strong>Return Date:</strong>
            <span>${bookingDetails.returnDate}</span>
          </div>
          <div class="detail-row">
            <strong>Delivery Address:</strong>
            <span>${bookingDetails.deliveryAddress}</span>
          </div>
          <div class="detail-row">
            <strong>Total:</strong>
            <span>$${bookingDetails.total.toFixed(2)}</span>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/confirm?booking=${bookingNumber}" class="button">View Booking</a>
          </p>
          
          <p style="margin-top: 30px;">
            <strong>What's Next?</strong><br>
            • We'll send you a reminder the day before delivery<br>
            • You'll receive an SMS when your clubs are on the way<br>
            • We'll pick up the clubs on your return date
          </p>
          
          <p style="margin-top: 20px;">
            Questions? Reply to this email or call us at (555) 123-4567.
          </p>
        </div>
        <div class="footer">
          <p>Birdie Golf Rentals<br>
          Golf Clubs Delivered To Your Tee Time</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Booking Confirmed! 🏌️
    
    Hi ${firstName},
    
    Your golf club rental is confirmed.
    
    Booking Number: ${bookingNumber}
    Club Set: ${bookingDetails.clubSetName}
    Delivery Date: ${bookingDetails.deliveryDate}
    Delivery Time: ${bookingDetails.deliveryTime}
    Return Date: ${bookingDetails.returnDate}
    Delivery Address: ${bookingDetails.deliveryAddress}
    Total: $${bookingDetails.total.toFixed(2)}
    
    View your booking: ${process.env.NEXT_PUBLIC_APP_URL}/booking/confirm?booking=${bookingNumber}
    
    Questions? Reply to this email or call us at (555) 123-4567.
    
    Birdie Golf Rentals
    Golf Clubs Delivered To Your Tee Time
  `

  return sendEmail({ to, subject, html, text })
}

export const sendDeliveryReminderEmail = async ({
  to,
  firstName,
  bookingNumber,
  deliveryDate,
  deliveryTime,
}: {
  to: string
  firstName: string
  bookingNumber: string
  deliveryDate: string
  deliveryTime: string
}) => {
  const subject = `Delivery Tomorrow - ${bookingNumber}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2D5A3D; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Delivery Tomorrow! 🚚</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          <p>This is a friendly reminder that your golf clubs will be delivered tomorrow.</p>
          
          <p><strong>Booking Number:</strong> ${bookingNumber}</p>
          <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
          <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
          
          <p>Please ensure someone is available to receive the clubs. Our driver will call upon arrival.</p>
          
          <p>Questions? Call us at (555) 123-4567.</p>
        </div>
        <div class="footer">
          <p>Birdie Golf Rentals</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}
