import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  GolfCourse,
  LocationType,
  Handedness,
  UberDirectEstimate,
  BookingInput 
} from '@/types'

// Fixed rental price
const RENTAL_PRICE = 59

interface BookingState {
  // Step 1: Tee Time Entry
  golfCourse: GolfCourse | null
  teeTime: Date | null
  numberOfPlayers: number
  handedness: Handedness
  
  // Step 2: Delivery Estimate
  deliveryLocationType: LocationType
  deliveryLocationName: string
  deliveryAddress: string
  deliveryAddress2: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  deliveryInstructions: string
  
  // Uber Direct estimates
  uberEstimate: UberDirectEstimate | null
  calculatedDeliveryTime: Date | null
  
  // Step 3: User Info
  userEmail: string
  userPhone: string
  userFirstName: string
  userLastName: string
  
  // Pricing (calculated)
  rentalPrice: number
  deliveryFee: number
  pickupFee: number
  subtotal: number
  tax: number
  total: number
  
  // Actions
  setTeeTimeInfo: (info: {
    golfCourse?: GolfCourse | null
    teeTime?: Date | null
    numberOfPlayers?: number
    handedness?: Handedness
  }) => void
  
  setDeliveryLocation: (location: {
    deliveryLocationType?: LocationType
    deliveryLocationName?: string
    deliveryAddress?: string
    deliveryAddress2?: string
    deliveryCity?: string
    deliveryState?: string
    deliveryZipCode?: string
    deliveryInstructions?: string
  }) => void
  
  setUberEstimate: (estimate: UberDirectEstimate | null) => void
  setCalculatedDeliveryTime: (time: Date | null) => void
  
  setUserInfo: (info: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
  }) => void
  
  calculatePricing: () => void
  
  getBookingInput: () => Partial<BookingInput>
  
  reset: () => void
  
  // Step tracking
  currentStep: number
  setCurrentStep: (step: number) => void
}

const initialState = {
  // Step 1
  golfCourse: null,
  teeTime: null,
  numberOfPlayers: 1,
  handedness: 'RIGHT' as Handedness,
  
  // Step 2
  deliveryLocationType: 'HOTEL' as LocationType,
  deliveryLocationName: '',
  deliveryAddress: '',
  deliveryAddress2: '',
  deliveryCity: '',
  deliveryState: '',
  deliveryZipCode: '',
  deliveryInstructions: '',
  
  // Uber Direct
  uberEstimate: null,
  calculatedDeliveryTime: null,
  
  // Step 3
  userEmail: '',
  userPhone: '',
  userFirstName: '',
  userLastName: '',
  
  // Pricing
  rentalPrice: RENTAL_PRICE,
  deliveryFee: 0,
  pickupFee: 0,
  subtotal: RENTAL_PRICE,
  tax: 0,
  total: RENTAL_PRICE,
  
  // Step tracking
  currentStep: 1,
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setTeeTimeInfo: (info) => {
        set((state) => ({
          ...state,
          golfCourse: info.golfCourse !== undefined ? info.golfCourse : state.golfCourse,
          teeTime: info.teeTime !== undefined ? info.teeTime : state.teeTime,
          numberOfPlayers: info.numberOfPlayers !== undefined ? info.numberOfPlayers : state.numberOfPlayers,
          handedness: info.handedness !== undefined ? info.handedness : state.handedness,
        }))
      },
      
      setDeliveryLocation: (location) => {
        set((state) => ({
          ...state,
          deliveryLocationType: location.deliveryLocationType ?? state.deliveryLocationType,
          deliveryLocationName: location.deliveryLocationName ?? state.deliveryLocationName,
          deliveryAddress: location.deliveryAddress ?? state.deliveryAddress,
          deliveryAddress2: location.deliveryAddress2 ?? state.deliveryAddress2,
          deliveryCity: location.deliveryCity ?? state.deliveryCity,
          deliveryState: location.deliveryState ?? state.deliveryState,
          deliveryZipCode: location.deliveryZipCode ?? state.deliveryZipCode,
          deliveryInstructions: location.deliveryInstructions ?? state.deliveryInstructions,
        }))
      },
      
      setUberEstimate: (estimate) => {
        set({ uberEstimate: estimate })
        get().calculatePricing()
      },
      
      setCalculatedDeliveryTime: (time) => {
        set({ calculatedDeliveryTime: time })
      },
      
      setUserInfo: (info) => {
        set((state) => ({
          ...state,
          userEmail: info.email ?? state.userEmail,
          userPhone: info.phone ?? state.userPhone,
          userFirstName: info.firstName ?? state.userFirstName,
          userLastName: info.lastName ?? state.userLastName,
        }))
      },
      
      calculatePricing: () => {
        const state = get()
        const { uberEstimate, rentalPrice } = state
        
        const deliveryFee = uberEstimate?.deliveryFee || 0
        const pickupFee = uberEstimate?.pickupFee || 0
        const subtotal = rentalPrice + deliveryFee + pickupFee
        const taxRate = 0.08 // 8% tax
        const tax = subtotal * taxRate
        const total = subtotal + tax
        
        set({
          deliveryFee,
          pickupFee,
          subtotal,
          tax,
          total,
        })
      },
      
      getBookingInput: () => {
        const state = get()
        return {
          golfCourseId: state.golfCourse?.id,
          golfCourseName: state.golfCourse?.name || '',
          golfCourseAddress: state.golfCourse ? 
            `${state.golfCourse.address}, ${state.golfCourse.city}, ${state.golfCourse.state} ${state.golfCourse.zipCode}` : '',
          teeTime: state.teeTime || new Date(),
          deliveryLocationType: state.deliveryLocationType,
          deliveryLocationName: state.deliveryLocationName,
          deliveryAddress: state.deliveryAddress,
          deliveryAddress2: state.deliveryAddress2,
          deliveryCity: state.deliveryCity,
          deliveryState: state.deliveryState,
          deliveryZipCode: state.deliveryZipCode,
          deliveryInstructions: state.deliveryInstructions,
          calculatedDeliveryTime: state.calculatedDeliveryTime || new Date(),
          uberDeliveryEstimate: state.uberEstimate?.deliveryEta || 0,
          uberPickupEstimate: state.uberEstimate?.pickupEta || 0,
          deliveryFee: state.deliveryFee,
          pickupFee: state.pickupFee,
          rentalPrice: state.rentalPrice,
          handedness: state.handedness,
          numberOfPlayers: state.numberOfPlayers,
        }
      },
      
      reset: () => {
        set(initialState)
      },
      
      setCurrentStep: (step) => {
        set({ currentStep: step })
      },
    }),
    {
      name: 'booking-storage-v2',
    }
  )
)
