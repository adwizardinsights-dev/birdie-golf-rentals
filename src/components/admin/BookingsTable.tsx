"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock bookings data
const mockBookings = [
  {
    id: "BIRD-ABC123",
    customer: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    clubSet: "Premium Set",
    deliveryDate: "Mar 15, 2024",
    returnDate: "Mar 18, 2024",
    location: "Fontainebleau Miami Beach",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    total: 237.00,
  },
  {
    id: "BIRD-DEF456",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    clubSet: "Standard Set",
    deliveryDate: "Mar 16, 2024",
    returnDate: "Mar 17, 2024",
    location: "Trump National Doral",
    status: "PENDING",
    paymentStatus: "PENDING",
    total: 147.00,
  },
  {
    id: "BIRD-GHI789",
    customer: "Michael Brown",
    email: "michael@example.com",
    phone: "(555) 345-6789",
    clubSet: "Tour Set",
    deliveryDate: "Mar 14, 2024",
    returnDate: "Mar 16, 2024",
    location: "Waldorf Astoria",
    status: "DELIVERED",
    paymentStatus: "PAID",
    total: 387.00,
  },
  {
    id: "BIRD-JKL012",
    customer: "Emily Davis",
    email: "emily@example.com",
    phone: "(555) 456-7890",
    clubSet: "Premium Set",
    deliveryDate: "Mar 17, 2024",
    returnDate: "Mar 20, 2024",
    location: "The Ritz-Carlton",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    total: 237.00,
  },
  {
    id: "BIRD-MNO345",
    customer: "David Wilson",
    email: "david@example.com",
    phone: "(555) 567-8901",
    clubSet: "Standard Set",
    deliveryDate: "Mar 15, 2024",
    returnDate: "Mar 16, 2024",
    location: "Airbnb - Miami Beach",
    status: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID",
    total: 147.00,
  },
]

export function BookingsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)

  const filteredBookings = mockBookings.filter(
    (booking) =>
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      CONFIRMED: "default",
      PENDING: "warning",
      DELIVERED: "success",
      OUT_FOR_DELIVERY: "info",
      RETURNED: "secondary",
      CANCELLED: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status.replace(/_/g, " ")}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all rental bookings</p>
        </div>
        <Button className="bg-golf-green hover:bg-golf-green-dark">
          + New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Booking ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Club Set</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Delivery</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{booking.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{booking.clubSet}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p>{booking.deliveryDate}</p>
                      <p className="text-sm text-gray-500">{booking.location}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    ${booking.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{getStatusBadge(selectedBooking.status)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedBooking.customer}</p>
                <p className="text-sm text-gray-600">{selectedBooking.email}</p>
                <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Club Set</p>
                <p className="font-medium">{selectedBooking.clubSet}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-medium">{selectedBooking.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium">{selectedBooking.returnDate}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedBooking.location}</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="font-bold text-lg">${selectedBooking.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
