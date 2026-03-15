"use client"

import { useState } from "react"
import { MapPin, Clock, Users, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBookingStore } from "@/hooks/useBookingStore"
import { searchCourses, formatCourseAddress, type GolfCourse } from "@/lib/courses"
import type { Handedness } from "@/types"

interface TeeTimeStepProps {
  onNext: () => void
  onBack?: () => void
  isLoading: boolean
  setIsLoading?: (loading: boolean) => void
}

export function TeeTimeStep({ onNext, isLoading }: TeeTimeStepProps) {
  const { 
    golfCourse, 
    teeTime, 
    numberOfPlayers, 
    handedness,
    setTeeTimeInfo 
  } = useBookingStore()

  const [courseQuery, setCourseQuery] = useState(golfCourse?.name || "")
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(golfCourse)
  const [localTeeTime, setLocalTeeTime] = useState(teeTime ? formatTimeForInput(teeTime) : "")
  const [localPlayers, setLocalPlayers] = useState(numberOfPlayers.toString())
  const [localHandedness, setLocalHandedness] = useState<Handedness>(handedness)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const courseSuggestions = searchCourses(courseQuery)

  const handleCourseSelect = (course: GolfCourse) => {
    setSelectedCourse(course)
    setCourseQuery(course.name)
    setShowSuggestions(false)
  }

  const handleContinue = () => {
    if (selectedCourse && localTeeTime) {
      const [hours, minutes] = localTeeTime.split(':').map(Number)
      const teeTimeDate = new Date()
      teeTimeDate.setHours(hours, minutes, 0, 0)
      
      setTeeTimeInfo({
        golfCourse: selectedCourse,
        teeTime: teeTimeDate,
        numberOfPlayers: parseInt(localPlayers),
        handedness: localHandedness,
      })
      onNext()
    }
  }

  const isValid = selectedCourse && localTeeTime

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">When are you playing?</h2>
        <p className="mt-2 text-gray-600">
          Tell us your tee time and we'll calculate delivery
        </p>
      </div>

      <div className="space-y-6">
        {/* Golf Course */}
        <div className="relative">
          <Label htmlFor="course" className="text-base font-medium text-gray-700">
            Golf Course
          </Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="course"
              placeholder="Search for a course..."
              value={courseQuery}
              onChange={(e) => {
                setCourseQuery(e.target.value)
                setShowSuggestions(true)
                if (e.target.value === '') setSelectedCourse(null)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 h-14 text-lg"
            />
          </div>
          
          {/* Course Suggestions */}
          {showSuggestions && courseSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-auto">
              {courseSuggestions.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0"
                >
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-500">{formatCourseAddress(course)}</p>
                </button>
              ))}
            </div>
          )}
          
          {selectedCourse && (
            <p className="mt-2 text-sm text-gray-500">
              {formatCourseAddress(selectedCourse)}
            </p>
          )}
        </div>

        {/* Tee Time */}
        <div>
          <Label htmlFor="teeTime" className="text-base font-medium text-gray-700">
            Tee Time
          </Label>
          <div className="relative mt-2">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="teeTime"
              type="time"
              value={localTeeTime}
              onChange={(e) => setLocalTeeTime(e.target.value)}
              className="pl-10 h-14 text-lg"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            We'll deliver your clubs at least 30 minutes before your tee time
          </p>
        </div>

        {/* Number of Players */}
        <div>
          <Label htmlFor="players" className="text-base font-medium text-gray-700">
            Number of Players
          </Label>
          <div className="relative mt-2">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="players"
              value={localPlayers}
              onChange={(e) => setLocalPlayers(e.target.value)}
              className="w-full h-14 pl-10 pr-4 rounded-md border border-input bg-background text-lg appearance-none"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Player' : 'Players'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Handedness */}
        <div>
          <Label className="text-base font-medium text-gray-700">
            Handedness
          </Label>
          <div className="flex space-x-6 mt-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="RIGHT"
                checked={localHandedness === 'RIGHT'}
                onChange={(e) => setLocalHandedness(e.target.value as Handedness)}
                className="h-5 w-5 text-golf-green"
              />
              <span className="text-lg">Right-handed</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="LEFT"
                checked={localHandedness === 'LEFT'}
                onChange={(e) => setLocalHandedness(e.target.value as Handedness)}
                className="h-5 w-5 text-golf-green"
              />
              <span className="text-lg">Left-handed</span>
            </label>
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

function formatTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
