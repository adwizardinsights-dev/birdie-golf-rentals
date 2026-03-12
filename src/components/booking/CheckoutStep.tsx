"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Shield, Lock, User, Mail, Phone, MapPin, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useBookingStore } from "@/hooks/useBookingStore"
import { formatPrice, formatDeliveryTimeMessage } from "@/lib/utils"

interface CheckoutStepProps {
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function CheckoutStep({ onBack, isLoading, setIsLoading }: CheckoutStepProps) {
  const router = useRouter()
  const {
    golfCourse,
    teeTime,
    calculatedDeliveryTime,
    deliveryLocationType,
    deliveryLocationName,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZipCode,
    rentalPrice,
    deliveryFee,
    pickupFee,
    subtotal,
    tax,
    total,
    numberOfPlayers,
    handedness,
    setUserInfo,
    reset,
  } = useBookingStore()

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    // Store user info
    setUserInfo({
      email: customerInfo.email,
      phone: customerInfo.phone,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
    })

    // Simulate API call to create booking
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Generate booking number
      const bookingNumber = `BIRD-${Date.now().toString(36).toUpperCase()}`
      
      // Reset booking store
      reset()
      
      // Redirect to success page
      router.push(`/booking/success?booking=${bookingNumber}`)
    } catch (error) {
      console.error("Booking error:", error)
      setIsLoading(false)
    }
  }

  const isValid =
    customerInfo.firstName &&
    customerInfo.lastName &&
    customerInfo.email &&
    customerInfo.phone &&
    paymentInfo.cardNumber &&
    paymentInfo.expiryDate &&
    paymentInfo.cvc &&
    agreedToTerms

  const locationTypeLabels: Record<string, string> = {
    HOTEL: 'Hotel',
    GOLF_COURSE: 'Golf Course',
    AIRBNB: 'Airbnb',
    RESIDENCE: 'Home',
    BUSINESS: 'Business',
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Complete Your Booking</h2>
        <p className="mt-2 text-gray-600">
          Review your order and enter payment details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-golf-green" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                    }
                    className="h-12 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                    }
                    className="h-12 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    className="h-12 pl-10 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    className="h-12 pl-10 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-golf-green" />
              Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                    }
                    className="h-12 pl-10 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
                    }
                    className="h-12 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={paymentInfo.cvc}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cvc: e.target.value })
                      }
                      className="h-12 pl-10 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>Payments secured by Stripe</span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-golf-green focus:ring-golf-green mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-golf-green hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-golf-green hover:underline">Rental Agreement</a>.
            </Label>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

          {/* Tee Time Info */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{golfCourse?.name}</p>
                <p className="text-sm text-gray-500">
                  {teeTime?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
                <p className="text-sm text-gray-500">
                  {numberOfPlayers} {numberOfPlayers === 1 ? 'player' : 'players'}, {handedness.toLowerCase()}-handed
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Delivery</p>
                {calculatedDeliveryTime && teeTime && (
                  <p className="text-sm text-gray-600">
                    {formatDeliveryTimeMessage(calculatedDeliveryTime, teeTime)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Standard Golf Club Set</span>
              <span>{formatPrice(rentalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                Delivery
              </span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <Truck className="h-3 w-3 mr-1 rotate-180" />
                Pickup
              </span>
              <span>{formatPrice(pickupFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-golf-green">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="h-12 px-6">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="bg-golf-green hover:bg-golf-green-dark h-12 px-8"
        >
          {isLoading ? 'Processing...' : 'Complete Booking'}
        </Button>
      </div>
    </div>
  )
}
