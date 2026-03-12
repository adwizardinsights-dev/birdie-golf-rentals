"use client"

import { useState } from "react"
import { MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useBookingStore } from "@/hooks/useBookingStore"
import { formatDate, cn } from "@/lib/utils"
import type { Handedness } from "@/types"

interface SearchStepProps {
  onNext: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function SearchStep({ onNext, isLoading }: SearchStepProps) {
  const { 
    searchLocation, 
    searchDate, 
    searchSets, 
    searchHandedness,
    setSearchParams 
  } = useBookingStore()

  const [location, setLocation] = useState(searchLocation)
  const [date, setDate] = useState<Date | undefined>(searchDate || undefined)
  const [sets, setSets] = useState(searchSets.toString())
  const [handedness, setHandedness] = useState<Handedness>(searchHandedness)

  const handleContinue = () => {
    setSearchParams({
      location,
      date: date || null,
      sets: parseInt(sets),
      handedness,
    })
    onNext()
  }

  const isValid = location && date

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Where are you playing?</h2>
        <p className="mt-2 text-gray-600">
          Enter your delivery location and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-base font-medium text-gray-700">
            Delivery Location
          </Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="location"
              placeholder="Hotel name, golf course, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-14 text-lg"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            We deliver to hotels, golf courses, Airbnbs, and residences
          </p>
        </div>

        {/* Date */}
        <div>
          <Label className="text-base font-medium text-gray-700">Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-14 mt-2",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                {date ? formatDate(date) : "Select your delivery date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sets and Handedness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sets" className="text-base font-medium text-gray-700">
              Number of Sets
            </Label>
            <Select value={sets} onValueChange={setSets}>
              <SelectTrigger className="h-14 mt-2">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                <SelectValue placeholder="Select sets" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Set" : "Sets"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700">Handedness</Label>
            <RadioGroup
              value={handedness}
              onValueChange={(v) => setHandedness(v as Handedness)}
              className="flex space-x-4 mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RIGHT" id="right" />
                <Label htmlFor="right" className="cursor-pointer">Right</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LEFT" id="left" />
                <Label htmlFor="left" className="cursor-pointer">Left</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!isValid || isLoading}
          className="bg-golf-green hover:bg-golf-green-dark h-12 px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
