"use client"

import { useState, useEffect } from "react"
import { MapPin, Building2, Home, Hotel, Briefcase, Clock, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBookingStore } from "@/hooks/useBookingStore"
import { getMockDeliveryEstimate, calculateDeliveryTime, formatDeliveryTimeMessage } from "@/lib/uber-direct"
import { formatCourseAddress } from "@/lib/courses"
import { formatPrice, cn } from "@/lib/utils"
import type { LocationType, UberDirectEstimate } from "@/types"

interface DeliveryEstimateStepProps {
  onNext: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const locationTypes: { value: LocationType; label: string; icon: React.ElementType }[] = [
  { value: 'HOTEL', label: 'Hotel', icon: Hotel },
  { value: 'GOLF_COURSE', label: 'Golf Course', icon: MapPin },
  { value: 'AIRBNB', label: 'Airbnb / Rental', icon: Home },
  { value: 'RESIDENCE', label: 'Home', icon: Building2 },
  { value: 'BUSINESS', label: 'Business', icon: Briefcase },
]

export function DeliveryEstimateStep({ onNext, onBack, isLoading, setIsLoading }: DeliveryEstimateStepProps) {
  const { 
    golfCourse,
    teeTime,
    deliveryLocationType,
    deliveryLocationName,
    deliveryAddress,
    deliveryAddress2,
    deliveryCity,
    deliveryState,
    deliveryZipCode,
    deliveryInstructions,
    uberEstimate,
    calculatedDeliveryTime,
    rentalPrice,
    deliveryFee,
    pickupFee,
    subtotal,
    tax,
    total,
    setDeliveryLocation,
    setUberEstimate,
    setCalculatedDeliveryTime,
  } = useBookingStore()

  const [selectedType, setSelectedType] = useState<LocationType>(deliveryLocationType)
  const [locationName, setLocationName] = useState(deliveryLocationName)
  const [address, setAddress] = useState(deliveryAddress)
  const [address2, setAddress2] = useState(deliveryAddress2)
  const [city, setCity] = useState(deliveryCity)
  const [state, setState] = useState(deliveryState)
  const [zipCode, setZipCode] = useState(deliveryZipCode)
  const [instructions, setInstructions] = useState(deliveryInstructions)
  const [estimate, setEstimate] = useState<UberDirectEstimate | null>(uberEstimate)
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(calculatedDeliveryTime)

  // Calculate estimate when all fields are filled
  useEffect(() => {
    if (address && city && state && zipCode && teeTime && golfCourse) {
      calculateEstimate()
    }
  }, [address, city, state, zipCode])

  const calculateEstimate = async () => {
    setIsLoading(true)
    
    // In production, this would call the actual Uber Direct API
    // For now, use mock data
    const mockEstimate = getMockDeliveryEstimate()
    
    // Calculate delivery time: tee_time - (uber_eta + 15min buffer)
    const calculatedTime = calculateDeliveryTime(
      teeTime!,
      mockEstimate.deliveryEta,
      15 // 15 minute buffer
    )
    
    setEstimate(mockEstimate)
    setDeliveryTime(calculatedTime)
    setUberEstimate(mockEstimate)
    setCalculatedDeliveryTime(calculatedTime)
    
    setIsLoading(false)
  }

  const handleContinue = () => {
    setDeliveryLocation({
      deliveryLocationType: selectedType,
      deliveryLocationName: locationName,
      deliveryAddress: address,
      deliveryAddress2: address2,
      deliveryCity: city,
      deliveryState: state,
      deliveryZipCode: zipCode,
      deliveryInstructions: instructions,
    })
    onNext()
  }

  const isValid = address && city && state && zipCode && estimate

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Where should we deliver?</h2>
        <p className="mt-2 text-gray-600">
          We'll calculate delivery and pickup costs
        </p>
      </div>

      {/* Golf Course Info */}
      {golfCourse && (
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Playing at</p>
          <p className="font-semibold text-gray-900">{golfCourse.name}</p>
          <p className="text-sm text-gray-600">
            Tee time: {teeTime?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Location Type */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            Delivery Location Type
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locationTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                    selectedType === type.value
                      ? "border-golf-green bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Icon className={cn(
                    "h-6 w-6 mb-2",
                    selectedType === type.value ? "text-golf-green" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    selectedType === type.value ? "text-golf-green" : "text-gray-600"
                  )}>
                    {type.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Location Name */}
        <div>
          <Label htmlFor="locationName" className="text-base font-medium text-gray-700">
            Location Name (Optional)
          </Label>
          <Input
            id="locationName"
            placeholder="e.g., Fontainebleau Hotel, Room 123"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="h-12 mt-2"
          />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-base font-medium text-gray-700">
            Street Address
          </Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="address"
              placeholder="123 Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="h-12 mt-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </Label>
            <Input
              id="city"
              placeholder="Miami"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-12 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
              ZIP
            </Label>
            <Input
              id="zipCode"
              placeholder="33101"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
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
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="h-12 mt-2"
          />
        </div>
      </div>

      {/* Estimate Display */}
      {estimate && deliveryTime && teeTime && (
        <div className="bg-green-50 rounded-xl p-6 space-y-4">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-golf-green mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Delivery Time</p>
              <p className="text-gray-700">
                {formatDeliveryTimeMessage(deliveryTime, teeTime)}
              </p>
            </div>
          </div>

          <div className="border-t border-green-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Standard Golf Club Set</span>
              <span className="font-medium">{formatPrice(rentalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Delivery
              </span>
              <span className="font-medium">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center">
                <Truck className="h-4 w-4 mr-2 rotate-180" />
                Pickup
              </span>
              <span className="font-medium">{formatPrice(pickupFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-green-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-golf-green">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}

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
