"use client"

import { useState } from "react"
import { MapPin, Clock, Building, Home, Flag, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBookingStore } from "@/hooks/useBookingStore"
import { formatDate, cn } from "@/lib/utils"

interface DeliveryDetailsStepProps {
  onNext: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function DeliveryDetailsStep({ onNext, onBack }: DeliveryDetailsStepProps) {
  const { 
    deliveryDate, 
    deliveryTimeSlot, 
    returnDate,
    searchLocation,
    setDeliveryAddress,
    setTeeTime 
  } = useBookingStore()

  const [address, setAddress] = useState({
    street: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
  })

  const [teeTimeInfo, setTeeTimeInfo] = useState({
    hasTeeTime: false,
    time: "",
    courseName: "",
  })

  const handleContinue = () => {
    setDeliveryAddress({
      deliveryAddress: address.street,
      deliveryAddress2: address.address2,
      deliveryCity: address.city,
      deliveryState: address.state,
      deliveryZipCode: address.zipCode,
      deliveryInstructions: address.instructions,
    })

    if (teeTimeInfo.hasTeeTime && teeTimeInfo.time) {
      const [hours, minutes] = teeTimeInfo.time.split(':')
      const teeTimeDate = new Date(deliveryDate!)
      teeTimeDate.setHours(parseInt(hours), parseInt(minutes))
      setTeeTime(teeTimeDate, teeTimeInfo.courseName)
    }

    onNext()
  }

  const isValid = 
    address.street && 
    address.city && 
    address.state && 
    address.zipCode

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
        <p className="mt-2 text-gray-600">
          Tell us exactly where to deliver your clubs
        </p>
      </div>

      <div className="space-y-6">
        {/* Delivery Summary */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-golf-green mr-2" />
              <span className="font-medium text-gray-900">
                {formatDate(deliveryDate!)}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-golf-green mr-2" />
              <span className="font-medium text-gray-900">
                {deliveryTimeSlot === "MORNING" && "Morning (8AM-12PM)"}
                {deliveryTimeSlot === "AFTERNOON" && "Afternoon (12PM-5PM)"}
                {deliveryTimeSlot === "EVENING" && "Evening (5PM-8PM)"}
              </span>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="street" className="text-base font-medium text-gray-700">
              Street Address
            </Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="street"
                placeholder="123 Main Street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address2" className="text-sm font-medium text-gray-700">
              Apartment, Suite, etc. (Optional)
            </Label>
            <Input
              id="address2"
              placeholder="Apt 4B, Room 123, etc."
              value={address.address2}
              onChange={(e) => setAddress({ ...address, address2: e.target.value })}
              className="h-12 mt-2"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="Miami"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="h-12 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State
              </Label>
              <Input
                id="state"
                placeholder="FL"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="h-12 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                placeholder="33101"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="h-12 mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
              Delivery Instructions (Optional)
            </Label>
            <Input
              id="instructions"
              placeholder="Leave at front desk, call upon arrival, etc."
              value={address.instructions}
              onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
              className="h-12 mt-2"
            />
          </div>
        </div>

        {/* Tee Time Section */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="hasTeeTime"
              checked={teeTimeInfo.hasTeeTime}
              onChange={(e) => setTeeTimeInfo({ ...teeTimeInfo, hasTeeTime: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-golf-green focus:ring-golf-green"
            />
            <Label htmlFor="hasTeeTime" className="text-base font-medium text-gray-700 cursor-pointer">
              I have a tee time
            </Label>
          </div>

          {teeTimeInfo.hasTeeTime && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
              <div>
                <Label htmlFor="teeTime" className="text-sm font-medium text-gray-700">
                  Tee Time
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="teeTime"
                    type="time"
                    value={teeTimeInfo.time}
                    onChange={(e) => setTeeTimeInfo({ ...teeTimeInfo, time: e.target.value })}
                    className="pl-10 h-12"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  We'll deliver at least 1 hour before your tee time
                </p>
              </div>

              <div>
                <Label htmlFor="courseName" className="text-sm font-medium text-gray-700">
                  Golf Course Name (Optional)
                </Label>
                <div className="relative mt-2">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="courseName"
                    placeholder="Trump National Doral"
                    value={teeTimeInfo.courseName}
                    onChange={(e) => setTeeTimeInfo({ ...teeTimeInfo, courseName: e.target.value })}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Delivery Information</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>We'll deliver to hotels, golf courses, Airbnbs, and residences</li>
              <li>Someone must be available to receive the clubs</li>
              <li>Driver will call 15 minutes before arrival</li>
              <li>Return pickup is from the same location</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="h-12 px-6">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isValid}
          className="bg-golf-green hover:bg-golf-green-dark h-12 px-8"
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  )
}
