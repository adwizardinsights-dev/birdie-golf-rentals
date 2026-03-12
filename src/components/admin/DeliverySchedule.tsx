"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Truck, User, Phone, CheckCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock delivery data
const mockDeliveries = {
  today: [
    {
      id: "DEL-001",
      time: "8:00 AM",
      customer: "John Smith",
      phone: "(555) 123-4567",
      address: "Fontainebleau Miami Beach",
      location: "4441 Collins Ave, Miami Beach, FL",
      clubSet: "Premium Set",
      status: "COMPLETED",
      type: "DELIVERY",
    },
    {
      id: "DEL-002",
      time: "9:30 AM",
      customer: "Sarah Johnson",
      phone: "(555) 234-5678",
      address: "Trump National Doral",
      location: "4400 NW 87th Ave, Doral, FL",
      clubSet: "Standard Set",
      status: "IN_PROGRESS",
      type: "DELIVERY",
    },
    {
      id: "DEL-003",
      time: "11:00 AM",
      customer: "Michael Brown",
      phone: "(555) 345-6789",
      address: "Waldorf Astoria",
      location: "1001 Oceanside Dr, Miami Beach, FL",
      clubSet: "Tour Set",
      status: "SCHEDULED",
      type: "DELIVERY",
    },
    {
      id: "DEL-004",
      time: "2:00 PM",
      customer: "Emily Davis",
      phone: "(555) 456-7890",
      address: "The Ritz-Carlton",
      location: "455 Grand Bay Dr, Key Biscayne, FL",
      clubSet: "Premium Set",
      status: "SCHEDULED",
      type: "DELIVERY",
    },
  ],
  returns: [
    {
      id: "RET-001",
      time: "10:00 AM",
      customer: "David Wilson",
      phone: "(555) 567-8901",
      address: "Airbnb - Miami Beach",
      location: "123 Ocean Dr, Miami Beach, FL",
      clubSet: "Standard Set",
      status: "SCHEDULED",
      type: "RETURN",
    },
    {
      id: "RET-002",
      time: "3:00 PM",
      customer: "Lisa Anderson",
      phone: "(555) 678-9012",
      address: "Four Seasons",
      location: "1435 Brickell Ave, Miami, FL",
      clubSet: "Premium Set",
      status: "SCHEDULED",
      type: "RETURN",
    },
  ],
}

const drivers = [
  { id: "1", name: "Carlos Rodriguez", phone: "(555) 111-2222", activeDeliveries: 3 },
  { id: "2", name: "Maria Garcia", phone: "(555) 222-3333", activeDeliveries: 2 },
]

export function DeliverySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      SCHEDULED: "warning",
      IN_PROGRESS: "info",
      COMPLETED: "success",
      CANCELLED: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status.replace(/_/g, " ")}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Schedule</h1>
          <p className="text-gray-600">Manage daily deliveries and returns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedDate.toLocaleDateString()}
          </Button>
          <Button className="bg-golf-green hover:bg-golf-green-dark">
            <Navigation className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
        </div>
      </div>

      {/* Driver Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-golf-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {driver.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-golf-green">{driver.activeDeliveries}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Tabs */}
      <Tabs defaultValue="deliveries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deliveries">
            Deliveries ({mockDeliveries.today.length})
          </TabsTrigger>
          <TabsTrigger value="returns">
            Returns ({mockDeliveries.returns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries" className="mt-6">
          <div className="space-y-4">
            {mockDeliveries.today.map((delivery, index) => (
              <Card key={delivery.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">{delivery.time}</span>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <p className="font-medium text-gray-900 mt-1">{delivery.customer}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {delivery.address}
                        </p>
                        <p className="text-sm text-gray-500">{delivery.location}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            <span className="text-gray-500">Club Set:</span>{" "}
                            <span className="font-medium">{delivery.clubSet}</span>
                          </span>
                          <span className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {delivery.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {delivery.status === "SCHEDULED" && (
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      )}
                      {delivery.status === "IN_PROGRESS" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="returns" className="mt-6">
          <div className="space-y-4">
            {mockDeliveries.returns.map((returnItem, index) => (
              <Card key={returnItem.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Truck className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">{returnItem.time}</span>
                          {getStatusBadge(returnItem.status)}
                        </div>
                        <p className="font-medium text-gray-900 mt-1">{returnItem.customer}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {returnItem.address}
                        </p>
                        <p className="text-sm text-gray-500">{returnItem.location}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            <span className="text-gray-500">Club Set:</span>{" "}
                            <span className="font-medium">{returnItem.clubSet}</span>
                          </span>
                          <span className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {returnItem.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Picked Up
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Route Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s Route Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4</p>
              <p className="text-sm text-gray-500">Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">2</p>
              <p className="text-sm text-gray-500">Returns</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">1</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">45 mi</p>
              <p className="text-sm text-gray-500">Total Distance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
