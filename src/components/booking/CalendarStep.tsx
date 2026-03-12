"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar as CalendarIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useBookingStore } from "@/hooks/useBookingStore"
import { formatDate, cn, addDays } from "@/lib/utils"
import type { TimeSlot } from "@/types"

interface CalendarStepProps {
  onNext: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const timeSlots: { value: TimeSlot; label: string; description: string }[] = [
  { value: "MORNING", label: "Morning", description: "8:00 AM - 12:00 PM" },
  { value: "AFTERNOON", label: "Afternoon", description: "12:00 PM - 5:00 PM" },
  { value: "EVENING", label: "Evening", description: "5:00 PM - 8:00 PM" },
]

export function CalendarStep({ onNext, onBack }: CalendarStepProps) {
  const { 
    searchDate, 
    deliveryDate, 
    deliveryTimeSlot, 
    returnDate, 
    returnTimeSlot,
    setDeliveryDetails 
  } = useBookingStore()

  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | undefined>(
    deliveryDate || searchDate || undefined
  )
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<TimeSlot | undefined>(
    deliveryTimeSlot || undefined
  )
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | undefined>(
    returnDate || undefined
  )
  const [selectedReturnSlot, setSelectedReturnSlot] = useState<TimeSlot | undefined>(
    returnTimeSlot || undefined
  )

  // Set default return date to delivery date + 1 day
  useEffect(() => {
    if (selectedDeliveryDate && !selectedReturnDate) {
      setSelectedReturnDate(addDays(selectedDeliveryDate, 1))
    }
  }, [selectedDeliveryDate, selectedReturnDate])

  const handleContinue = () => {
    if (selectedDeliveryDate && selectedDeliverySlot && selectedReturnDate) {
      setDeliveryDetails({
        deliveryDate: selectedDeliveryDate,
        deliveryTimeSlot: selectedDeliverySlot,
        returnDate: selectedReturnDate,
        returnTimeSlot: selectedReturnSlot,
      })
      onNext()
    }
  }

  const isValid = selectedDeliveryDate && selectedDeliverySlot && selectedReturnDate

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Your Dates</h2>
        <p className="mt-2 text-gray-600">
          Choose when you want your clubs delivered and returned
        </p>
      </div>

      <div className="space-y-8">
        {/* Delivery Section */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-golf-green" />
            Delivery
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Delivery Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedDeliveryDate}
                onSelect={setSelectedDeliveryDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border bg-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Delivery Time Window
              </Label>
              <RadioGroup
                value={selectedDeliverySlot}
                onValueChange={(v) => setSelectedDeliverySlot(v as TimeSlot)}
                className="space-y-3"
              >
                {timeSlots.map((slot) => (
                  <div key={slot.value}>
                    <RadioGroupItem
                      value={slot.value}
                      id={`delivery-${slot.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`delivery-${slot.value}`}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                        selectedDeliverySlot === slot.value
                          ? "border-golf-green bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{slot.label}</p>
                          <p className="text-sm text-gray-500">{slot.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Return Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
            Return
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Return Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedReturnDate}
                onSelect={setSelectedReturnDate}
                disabled={(date) => 
                  !selectedDeliveryDate || date < selectedDeliveryDate
                }
                className="rounded-md border bg-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Return Time Window (Optional)
              </Label>
              <RadioGroup
                value={selectedReturnSlot}
                onValueChange={(v) => setSelectedReturnSlot(v as TimeSlot)}
                className="space-y-3"
              >
                <div>
                  <RadioGroupItem
                    value=""
                    id="return-any"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="return-any"
                    className={cn(
                      "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                      !selectedReturnSlot
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div>
                      <p className="font-medium text-gray-900">Any Time</p>
                      <p className="text-sm text-gray-500">We'll coordinate pickup</p>
                    </div>
                  </Label>
                </div>
                {timeSlots.map((slot) => (
                  <div key={slot.value}>
                    <RadioGroupItem
                      value={slot.value}
                      id={`return-${slot.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`return-${slot.value}`}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                        selectedReturnSlot === slot.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{slot.label}</p>
                          <p className="text-sm text-gray-500">{slot.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedDeliveryDate && selectedReturnDate && (
          <div className="bg-gray-100 rounded-xl p-4 flex items-start">
            <Info className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                <strong>Rental Period:</strong>{" "}
                {formatDate(selectedDeliveryDate)} - {formatDate(selectedReturnDate)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.ceil(
                  (selectedReturnDate.getTime() - selectedDeliveryDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{" "}
                days rental
              </p>
            </div>
          </div>
        )}
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
          Continue
        </Button>
      </div>
    </div>
  )
}
