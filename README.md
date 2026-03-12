# Birdie Golf Rentals

A full-stack golf club rental platform built with Next.js, PostgreSQL, Prisma, and Stripe.

## Features

- **Homepage** - Beautiful landing page with search widget
- **Booking Flow** - 5-step booking process (Search → Dates → Clubs → Delivery → Checkout)
- **Availability Calendar** - Interactive calendar with time slot selection
- **Club Selection** - Three tiers: Standard, Premium, Tour
- **Stripe Checkout** - Secure payment processing with Apple Pay & Google Pay support
- **Booking Confirmation** - Email and SMS notifications
- **Admin Dashboard** - Manage bookings, inventory, customers, payments, and deliveries
- **Delivery Scheduler** - Route optimization and driver management

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Zustand (state management)

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Integrations
- Stripe (payments)
- Twilio (SMS notifications)
- Resend/SendGrid (email notifications)
- Google Maps API (location search)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account
- Twilio account (optional, for SMS)
- Resend/SendGrid account (optional, for email)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd birdie-golf-rentals
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/birdie_golf_rentals?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"
RESEND_API_KEY="re_..."
FROM_EMAIL="bookings@birdiegolfrentals.com"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
birdie-golf-rentals/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   ├── booking/
│   │   │   ├── page.tsx       # Booking flow
│   │   │   └── success/
│   │   │       └── page.tsx   # Success page
│   │   ├── admin/
│   │   │   └── page.tsx       # Admin dashboard
│   │   └── api/
│   │       ├── bookings/
│   │       │   └── route.ts   # Bookings API
│   │       ├── inventory/
│   │       │   └── route.ts   # Inventory API
│   │       ├── payments/
│   │       │   └── intent/
│   │       │       └── route.ts  # Payment intent API
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts  # Stripe webhooks
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── booking/           # Booking flow components
│   │   └── admin/             # Admin dashboard components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── stripe.ts          # Stripe config
│   │   ├── twilio.ts          # Twilio config
│   │   ├── email.ts           # Email service
│   │   └── utils.ts           # Utilities
│   ├── hooks/
│   │   └── useBookingStore.ts # Booking state management
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   └── images/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings?id={id}` - Update a booking

### Inventory
- `GET /api/inventory` - Get inventory data
- `POST /api/inventory` - Create/update inventory
- `PATCH /api/inventory?id={id}` - Update inventory quantity

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Database Schema

### Core Tables
- **Users** - Customers, admins, and drivers
- **GolfClubSets** - Available club sets (Standard, Premium, Tour)
- **Inventory** - Stock tracking per location
- **Locations** - Delivery locations (hotels, golf courses)
- **Bookings** - Rental bookings
- **Payments** - Payment records
- **Notifications** - SMS/Email notification logs
- **DeliveryRoutes** - Driver route planning

## Booking Flow

1. **Search** - User enters location, date, sets, and handedness
2. **Calendar** - Select delivery and return dates with time slots
3. **Club Selection** - Choose from Standard ($49/day), Premium ($79/day), or Tour ($129/day)
4. **Delivery Details** - Enter address and optional tee time
5. **Checkout** - Enter contact info and payment details
6. **Confirmation** - Booking confirmed, notifications sent

## Admin Dashboard

### Sections
- **Dashboard** - Overview stats and recent bookings
- **Bookings** - View and manage all bookings
- **Inventory** - Manage club set inventory across locations
- **Customers** - Customer database and history
- **Payments** - Payment tracking and refunds
- **Deliveries** - Route planning and driver management

## Notifications

### SMS (Twilio)
- Booking confirmation
- Delivery reminder (day before)
- Out for delivery
- Delivered confirmation
- Return reminder

### Email (Resend/SendGrid)
- Booking confirmation with details
- Payment receipt
- Delivery reminder
- Return instructions

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Environment Variables for Production

Make sure to set these in your production environment:
- `DATABASE_URL` - Production PostgreSQL URL
- `STRIPE_SECRET_KEY` - Live Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Live Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret
- `NEXT_PUBLIC_APP_URL` - Production URL
- `TWILIO_*` - Twilio credentials (optional)
- `RESEND_API_KEY` - Resend API key (optional)

## Stripe Webhook Setup

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Customization

### Adding New Club Sets

Edit `prisma/seed.ts` and run:
```bash
npx prisma db seed
```

### Modifying Pricing

Update prices in:
1. Database via Prisma Studio: `npx prisma studio`
2. Or create a migration: `npx prisma migrate dev`

### Changing Time Slots

Edit the settings in the database or modify:
- `src/components/booking/CalendarStep.tsx`
- `prisma/schema.prisma` (TimeSlot enum)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@birdiegolfrentals.com or call (555) 123-4567.

---

Built with ❤️ for golfers everywhere.
