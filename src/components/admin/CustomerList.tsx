"use client"

import { useState } from "react"
import { Search, Mail, Phone, Calendar, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock customers data
const mockCustomers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    totalBookings: 5,
    totalSpent: 1185.00,
    lastBooking: "Mar 15, 2024",
    status: "ACTIVE",
    bookings: [
      { id: "BIRD-ABC123", date: "Mar 15, 2024", total: 237.00, status: "CONFIRMED" },
      { id: "BIRD-XYZ789", date: "Feb 20, 2024", total: 237.00, status: "RETURNED" },
    ],
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    totalBookings: 3,
    totalSpent: 561.00,
    lastBooking: "Mar 16, 2024",
    status: "ACTIVE",
    bookings: [
      { id: "BIRD-DEF456", date: "Mar 16, 2024", total: 147.00, status: "PENDING" },
    ],
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "mbrown@example.com",
    phone: "(555) 345-6789",
    totalBookings: 8,
    totalSpent: 2496.00,
    lastBooking: "Mar 14, 2024",
    status: "VIP",
    bookings: [
      { id: "BIRD-GHI789", date: "Mar 14, 2024", total: 387.00, status: "DELIVERED" },
    ],
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    totalBookings: 2,
    totalSpent: 474.00,
    lastBooking: "Mar 17, 2024",
    status: "ACTIVE",
    bookings: [
      { id: "BIRD-JKL012", date: "Mar 17, 2024", total: 237.00, status: "CONFIRMED" },
    ],
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "dwilson@example.com",
    phone: "(555) 567-8901",
    totalBookings: 1,
    totalSpent: 147.00,
    lastBooking: "Mar 15, 2024",
    status: "NEW",
    bookings: [
      { id: "BIRD-MNO345", date: "Mar 15, 2024", total: 147.00, status: "OUT_FOR_DELIVERY" },
    ],
  },
]

export function CustomerList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null)

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      ACTIVE: "success",
      NEW: "info",
      VIP: "default",
      INACTIVE: "secondary",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer base</p>
        </div>
        <Button className="bg-golf-green hover:bg-golf-green-dark">
          + Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">248</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New This Month</p>
            <p className="text-2xl font-bold text-green-600">+42</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">VIP Customers</p>
            <p className="text-2xl font-bold text-amber-600">18</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Avg. Bookings</p>
            <p className="text-2xl font-bold text-blue-600">3.2</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Bookings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total Spent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Last Booking</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="font-semibold text-gray-600">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.email}
                      </p>
                      <p className="text-sm flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{customer.totalBookings}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {customer.lastBooking}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(customer.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-semibold text-gray-600">
                    {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                  <p className="text-gray-500">{selectedCustomer.email}</p>
                  <p className="text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalBookings}</p>
                  <p className="text-sm text-gray-500">Bookings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedCustomer.totalSpent.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(selectedCustomer.totalSpent / selectedCustomer.totalBookings).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-500">Avg. Order</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Recent Bookings
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.bookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{booking.id}</span>
                        <Badge variant="outline">{booking.status}</Badge>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                        <span>{booking.date}</span>
                        <span>${booking.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
