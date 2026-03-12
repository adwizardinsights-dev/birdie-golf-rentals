import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export function generateBookingNumber(): string {
  const prefix = 'BIRD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function calculateRentalDays(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.ceil(diffMs / msPerDay) + 1
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isDateInPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function getTimeSlotLabel(slot: string): string {
  const labels: Record<string, string> = {
    MORNING: 'Morning (8:00 AM - 12:00 PM)',
    AFTERNOON: 'Afternoon (12:00 PM - 5:00 PM)',
    EVENING: 'Evening (5:00 PM - 8:00 PM)',
  }
  return labels[slot] || slot
}

export function getClubTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    STANDARD: 'Standard',
    PREMIUM: 'Premium',
    TOUR: 'Tour',
  }
  return labels[tier] || tier
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Format delivery time message for display
export function formatDeliveryTimeMessage(
  deliveryTime: Date,
  teeTime: Date
): string {
  const deliveryTimeStr = deliveryTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  
  const teeTimeStr = teeTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return `Your clubs will arrive at ${deliveryTimeStr} before your ${teeTimeStr} tee time.`
}
