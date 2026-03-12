"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingNumber = searchParams.get("booking")
  
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your golf clubs are reserved and ready for delivery
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center border-b pb-6 mb-6">
              <p className="text-sm text-gray-500 mb-1">Booking Number</p>
              <p className="text-2xl font-bold text-golf-green">{bookingNumber}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Date</p>
                  <p className="text-gray-600">Tomorrow, March 15, 2024</p>
                  <p className="text-sm text-gray-500">Morning (8:00 AM - 12:00 PM)</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-600">Fontainebleau Miami Beach</p>
                  <p className="text-sm text-gray-500">4441 Collins Ave, Miami Beach, FL 33140</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Contact</p>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-gray-600">Sent to your email</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ve sent a detailed confirmation to your email with all booking details.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivery Reminder</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an SMS reminder the day before delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-amber-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Out for Delivery</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll text you when your clubs are on the way with an estimated arrival time.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Return Pickup</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll pick up the clubs on your return date. Leave them at the front desk.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 h-12">
            <Download className="h-5 w-5 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="flex-1 h-12">
            <Share2 className="h-5 w-5 mr-2" />
            Share Booking
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need help? Contact us anytime</p>
          <div className="flex justify-center space-x-4">
            <Button variant="link" className="text-golf-green">
              (555) 123-4567
            </Button>
            <Button variant="link" className="text-golf-green">
              support@birdiegolf.com
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild className="bg-golf-green hover:bg-golf-green-dark h-12 px-8">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
