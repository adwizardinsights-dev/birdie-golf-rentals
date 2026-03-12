"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Users, ArrowRight, Check, Menu, Golf, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useBookingStore } from "@/hooks/useBookingStore"
import { searchCourses, formatCourseAddress, type GolfCourse } from "@/lib/courses"
import { cn, formatPrice } from "@/lib/utils"
import type { Handedness } from "@/types"

export default function HomePage() {
  const router = useRouter()
  const { setTeeTimeInfo, setCurrentStep } = useBookingStore()
  
  // Form state
  const [courseQuery, setCourseQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null)
  const [teeTime, setTeeTime] = useState("")
  const [numberOfPlayers, setNumberOfPlayers] = useState("1")
  const [handedness, setHandedness] = useState<Handedness>("RIGHT")
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Search courses
  const courseSuggestions = searchCourses(courseQuery)

  const handleCourseSelect = (course: GolfCourse) => {
    setSelectedCourse(course)
    setCourseQuery(course.name)
    setShowCourseSuggestions(false)
  }

  const handleSearch = () => {
    if (selectedCourse && teeTime) {
      const [hours, minutes] = teeTime.split(':').map(Number)
      const teeTimeDate = new Date()
      teeTimeDate.setHours(hours, minutes, 0, 0)
      
      setTeeTimeInfo({
        golfCourse: selectedCourse,
        teeTime: teeTimeDate,
        numberOfPlayers: parseInt(numberOfPlayers),
        handedness,
      })
      setCurrentStep(1)
      router.push("/booking")
    }
  }

  const isValid = selectedCourse && teeTime

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center">
                <Golf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Birdie</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/admin">Admin</a>
              </Button>
              <Button className="bg-golf-green hover:bg-golf-green-dark" asChild>
                <a href="/booking">Book Now</a>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <hr />
                  <Button className="bg-golf-green hover:bg-golf-green-dark w-full" asChild>
                    <a href="/booking">Book Now</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Golf Clubs Delivered
              <br />
              <span className="text-golf-green">Before Your Tee Time</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600">
              Enter your tee time and we'll deliver your clubs right to your hotel or golf course.
            </p>
          </div>

          {/* Booking Widget */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Golf Course */}
                <div className="lg:col-span-2 relative">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Golf Course
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search for a course..."
                      value={courseQuery}
                      onChange={(e) => {
                        setCourseQuery(e.target.value)
                        setShowCourseSuggestions(true)
                        if (e.target.value === '') setSelectedCourse(null)
                      }}
                      onFocus={() => setShowCourseSuggestions(true)}
                      className="pl-10 h-12"
                    />
                  </div>
                  
                  {/* Course Suggestions */}
                  {showCourseSuggestions && courseSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-auto">
                      {courseSuggestions.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleCourseSelect(course)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0"
                        >
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-500">{course.city}, {course.state}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tee Time */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tee Time
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="time"
                      value={teeTime}
                      onChange={(e) => setTeeTime(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Players */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Players
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={numberOfPlayers}
                      onChange={(e) => setNumberOfPlayers(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Player' : 'Players'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Handedness */}
              <div className="mt-4 flex items-center space-x-6">
                <Label className="text-sm font-medium text-gray-700">Hand:</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="RIGHT"
                      checked={handedness === 'RIGHT'}
                      onChange={(e) => setHandedness(e.target.value as Handedness)}
                      className="h-4 w-4 text-golf-green"
                    />
                    <span className="text-sm">Right</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="LEFT"
                      checked={handedness === 'LEFT'}
                      onChange={(e) => setHandedness(e.target.value as Handedness)}
                      className="h-4 w-4 text-golf-green"
                    />
                    <span className="text-sm">Left</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!isValid}
                className="w-full mt-6 bg-golf-green hover:bg-golf-green-dark h-14 text-lg font-semibold disabled:opacity-50"
              >
                Check Availability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Renting golf clubs has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter Your Tee Time",
                description: "Tell us where and when you're playing. We'll calculate the perfect delivery time.",
              },
              {
                step: "2",
                title: "Get Delivery Estimate",
                description: "We calculate delivery and pickup costs in real-time using Uber Direct.",
              },
              {
                step: "3",
                title: "We Deliver & Pick Up",
                description: "Your clubs arrive before your tee time. We pick them up when you're done.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-golf-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Single Product */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              One set. One price. No surprises.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-golf-green text-white text-center py-4">
              <p className="font-semibold">Standard Golf Club Set</p>
            </div>
            <div className="p-8 text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">{formatPrice(59)}</span>
                <span className="text-gray-500">/rental</span>
              </div>
              
              <ul className="space-y-3 text-left mb-8">
                {[
                  "Quality name-brand clubs",
                  "Driver, woods, irons, putter",
                  "Stand bag included",
                  "Right & left-handed available",
                  "Delivery to hotel or course",
                  "Pickup included",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-golf-green mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-golf-green hover:bg-golf-green-dark h-12" asChild>
                <a href="/booking">Book Now</a>
              </Button>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Delivery and pickup fees calculated based on distance. Tax not included.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "On-Time Delivery",
                description: "Clubs arrive before your tee time, guaranteed",
              },
              {
                title: "Premium Brands",
                description: "TaylorMade, Callaway, Titleist & more",
              },
              {
                title: "Easy Pickup",
                description: "We collect clubs when you're done",
              },
              {
                title: "Real-Time Tracking",
                description: "Know exactly when your clubs will arrive",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-golf-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Play?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Book your clubs in under 30 seconds. We'll handle the rest.
          </p>
          <Button
            size="lg"
            className="bg-white text-golf-green hover:bg-gray-100 h-14 px-8 text-lg font-semibold"
            asChild
          >
            <a href="/booking">Get Started Now</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center">
                  <Golf className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Birdie</span>
              </div>
              <p className="text-gray-400">
                Golf clubs delivered before your tee time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Cancellation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Insurance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Birdie Golf Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
