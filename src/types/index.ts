// User Types
export interface User {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  role: 'CUSTOMER' | 'ADMIN' | 'DRIVER'
  createdAt: string
  updatedAt: string
}

export interface UserInput {
  email: string
  phone?: string
  firstName: string
  lastName: string
}

// Golf Course Types
export interface GolfCourse {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  phone?: string
}

// Uber Direct Types
export interface UberDirectEstimate {
  deliveryFee: number
  pickupFee: number
  deliveryEta: number // in minutes
  pickupEta: number // in minutes
  currency: string
}

// Location Types
export interface Location {
  id: string
  name: string
  type: LocationType
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  isActive: boolean
}

export type LocationType = 'HOTEL' | 'GOLF_COURSE' | 'AIRBNB' | 'RESIDENCE' | 'BUSINESS'

// Booking Types
export interface Booking {
  id: string
  bookingNumber: string
  userId: string
  user?: User
  
  // Golf Course
  golfCourseId?: string
  golfCourseName: string
  golfCourseAddress: string
  
  // Tee Time
  teeTime: string
  
  // Delivery/Pickup Location
  deliveryLocationType: LocationType
  deliveryLocationName: string
  deliveryAddress: string
  deliveryAddress2?: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  deliveryInstructions?: string
  
  // Calculated Delivery Time
  calculatedDeliveryTime: string
  
  // Uber Direct
  uberDeliveryEstimate: number
  uberPickupEstimate: number
  deliveryFee: number
  pickupFee: number
  
  // Pricing
  rentalPrice: number // Fixed at $59
  subtotal: number
  tax: number
  total: number
  
  // Status
  status: BookingStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  
  // Preferences
  handedness: Handedness
  numberOfPlayers: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  deliveredAt?: string
  returnedAt?: string
  cancelledAt?: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'FAILED'
export type DeliveryStatus = 'SCHEDULED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURN_SCHEDULED' | 'RETURNED'
export type Handedness = 'LEFT' | 'RIGHT'

// Booking Input Types
export interface BookingInput {
  userId?: string
  golfCourseId?: string
  golfCourseName: string
  golfCourseAddress: string
  teeTime: Date
  deliveryLocationType: LocationType
  deliveryLocationName: string
  deliveryAddress: string
  deliveryAddress2?: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  deliveryInstructions?: string
  calculatedDeliveryTime: Date
  uberDeliveryEstimate: number
  uberPickupEstimate: number
  deliveryFee: number
  pickupFee: number
  rentalPrice: number
  handedness: Handedness
  numberOfPlayers: number
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  userId: string
  stripePaymentIntentId?: string
  stripeChargeId?: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod?: string
  lastFour?: string
  createdAt: string
  updatedAt: string
}

// Notification Types
export interface Notification {
  id: string
  bookingId: string
  type: NotificationType
  channel: 'SMS' | 'EMAIL'
  status: 'PENDING' | 'SENT' | 'FAILED'
  to: string
  subject?: string
  body: string
  sentAt?: string
  createdAt: string
}

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'DELIVERY_REMINDER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURN_REMINDER'
  | 'RETURN_CONFIRMED'
  | 'CANCELLATION'

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard Types
export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  pendingDeliveries: number
  todayBookings: number
  weeklyRevenue: number
}

export interface RecentBooking {
  id: string
  bookingNumber: string
  customerName: string
  golfCourseName: string
  teeTime: string
  status: BookingStatus
  total: number
}

// Form Types
export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  cardNumber: string
  expiryDate: string
  cvc: string
}

// Stripe Types
export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}
