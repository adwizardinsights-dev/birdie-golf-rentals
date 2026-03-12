"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookingStore } from "@/hooks/useBookingStore"
import { cn } from "@/lib/utils"

// Step Components
import { TeeTimeStep } from "@/components/booking/TeeTimeStep"
import { DeliveryEstimateStep } from "@/components/booking/DeliveryEstimateStep"
import { CheckoutStep } from "@/components/booking/CheckoutStep"

const steps = [
  { id: 1, name: "Tee Time", component: TeeTimeStep },
  { id: 2, name: "Delivery", component: DeliveryEstimateStep },
  { id: 3, name: "Checkout", component: CheckoutStep },
]

export default function BookingPage() {
  const { currentStep, setCurrentStep, reset } = useBookingStore()
  
  const [isLoading, setIsLoading] = useState(false)

  const CurrentStepComponent = steps[currentStep - 1]?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Birdie</span>
            </a>
            <Button variant="ghost" size="sm" onClick={reset}>
              Start Over
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="flex-1">
                  <div
                    className={cn(
                      "group flex flex-col items-center w-full",
                    )}
                  >
                    <span className="flex items-center">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                          currentStep === step.id
                            ? "bg-golf-green text-white"
                            : currentStep > step.id
                            ? "bg-golf-green text-white"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          step.id
                        )}
                      </span>
                      {stepIdx < steps.length - 1 && (
                        <span
                          className={cn(
                            "hidden sm:block h-0.5 w-16 mx-2 transition-colors",
                            currentStep > step.id
                              ? "bg-golf-green"
                              : "bg-gray-200"
                          )}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "mt-2 text-xs sm:text-sm font-medium transition-colors",
                        currentStep === step.id
                          ? "text-golf-green"
                          : currentStep > step.id
                          ? "text-gray-900"
                          : "text-gray-500"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      </main>
    </div>
  )
}
