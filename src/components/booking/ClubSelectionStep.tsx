"use client"

import { useState, useEffect } from "react"
import { Check, Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBookingStore } from "@/hooks/useBookingStore"
import { formatPrice, cn } from "@/lib/utils"
import type { GolfClubSet } from "@/types"

interface ClubSelectionStepProps {
  onNext: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// Mock data - in production, this would come from the API
const mockClubSets: GolfClubSet[] = [
  {
    id: "1",
    name: "Standard Set",
    tier: "STANDARD",
    brand: "Callaway",
    model: "Strata",
    description: "Perfect for casual golfers and beginners",
    pricePerDay: 49,
    depositAmount: 100,
    imageUrl: "/images/standard-set.jpg",
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "Premium Set",
    tier: "PREMIUM",
    brand: "TaylorMade",
    model: "Stealth",
    description: "For serious golfers seeking performance",
    pricePerDay: 79,
    depositAmount: 200,
    imageUrl: "/images/premium-set.jpg",
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    name: "Tour Set",
    tier: "TOUR",
    brand: "Titleist",
    model: "TSR",
    description: "Professional-grade equipment",
    pricePerDay: 129,
    depositAmount: 500,
    imageUrl: "/images/tour-set.jpg",
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
]

const tierFeatures: Record<string, string[]> = {
  STANDARD: [
    "Driver & 3 Wood",
    "5-PW Irons",
    "Putter",
    "Stand bag",
    "Quality brands",
  ],
  PREMIUM: [
    "Driver, 3W & 5W",
    "4-PW Irons",
    "Wedge set",
    "Premium putter",
    "Cart bag",
    "GPS rangefinder",
  ],
  TOUR: [
    "Custom fitted driver",
    "Full wood set",
    "3-9 Iron set",
    "Specialty wedges",
    "Tour putter",
    "Staff bag",
    "Premium accessories",
  ],
}

const tierColors: Record<string, { bg: string; border: string; badge: string }> = {
  STANDARD: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500" },
  PREMIUM: { bg: "bg-green-50", border: "border-green-200", badge: "bg-golf-green" },
  TOUR: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500" },
}

export function ClubSelectionStep({ onNext, onBack, setIsLoading }: ClubSelectionStepProps) {
  const { 
    selectedClubSet, 
    rentalDays, 
    searchSets,
    setSelectedClubSet,
    calculatePricing 
  } = useBookingStore()

  const [clubSets, setClubSets] = useState<GolfClubSet[]>(mockClubSets)
  const [selectedId, setSelectedId] = useState<string | null>(selectedClubSet?.id || null)

  useEffect(() => {
    // In production, fetch from API
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setClubSets(mockClubSets)
      setIsLoading(false)
    }, 500)
  }, [setIsLoading])

  const handleSelect = (clubSet: GolfClubSet) => {
    setSelectedId(clubSet.id)
    setSelectedClubSet(clubSet)
    calculatePricing()
  }

  const handleContinue = () => {
    if (selectedClubSet) {
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Club Set</h2>
        <p className="mt-2 text-gray-600">
          Select the perfect set for your game
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {clubSets.map((clubSet) => {
          const colors = tierColors[clubSet.tier]
          const isSelected = selectedId === clubSet.id
          const totalPrice = parseFloat(clubSet.pricePerDay.toString()) * rentalDays * searchSets

          return (
            <div
              key={clubSet.id}
              onClick={() => handleSelect(clubSet)}
              className={cn(
                "relative rounded-xl border-2 cursor-pointer transition-all overflow-hidden",
                isSelected
                  ? `border-golf-green ring-2 ring-golf-green ring-offset-2`
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Popular Badge */}
              {clubSet.tier === "PREMIUM" && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-golf-green text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex flex-col md:flex-row">
                {/* Image Placeholder */}
                <div className={cn("w-full md:w-48 h-32 md:h-auto flex items-center justify-center", colors.bg)}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold" style={{ color: colors.badge === 'bg-golf-green' ? '#2D5A3D' : colors.badge.replace('bg-', '') }}>
                        {clubSet.tier[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{clubSet.name}</h3>
                        <Badge variant="secondary" className={cn("text-white", colors.badge)}>
                          {clubSet.tier}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{clubSet.description}</p>
                      <p className="text-sm text-gray-500">
                        {clubSet.brand} {clubSet.model}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(totalPrice)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatPrice(clubSet.pricePerDay)}/day × {rentalDays} days
                        {searchSets > 1 && ` × ${searchSets} sets`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        + {formatPrice(clubSet.depositAmount)} deposit per set
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {tierFeatures[clubSet.tier].map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center text-sm text-gray-600"
                        >
                          <Check className="h-4 w-4 text-golf-green mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className="px-6 pb-6 md:py-6 md:px-6 flex items-center">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      isSelected
                        ? "bg-golf-green border-golf-green"
                        : "border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          All club sets include a full set of clubs, bag, and tees. 
          Deposit is fully refundable upon return of equipment in good condition.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="h-12 px-6">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedId}
          className="bg-golf-green hover:bg-golf-green-dark h-12 px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
