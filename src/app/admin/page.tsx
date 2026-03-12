"use client"

import { useState } from "react"
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Users, 
  CreditCard, 
  Truck,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Admin Components
import { BookingsTable } from "@/components/admin/BookingsTable"
import { InventoryManager } from "@/components/admin/InventoryManager"
import { DeliverySchedule } from "@/components/admin/DeliverySchedule"
import { CustomerList } from "@/components/admin/CustomerList"
import { PaymentOverview } from "@/components/admin/PaymentOverview"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "deliveries", label: "Deliveries", icon: Truck },
]

// Mock stats data
const statsData = [
  {
    title: "Total Revenue",
    value: "$24,580",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Bookings",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "New Customers",
    value: "42",
    change: "+15.3%",
    trend: "up",
    icon: UserPlus,
  },
  {
    title: "Pending Deliveries",
    value: "18",
    change: "-5.1%",
    trend: "down",
    icon: Truck,
  },
]

// Mock recent bookings
const recentBookings = [
  {
    id: "BIRD-ABC123",
    customer: "John Smith",
    clubSet: "Premium Set",
    deliveryDate: "Mar 15, 2024",
    status: "CONFIRMED",
    total: "$237.00",
  },
  {
    id: "BIRD-DEF456",
    customer: "Sarah Johnson",
    clubSet: "Standard Set",
    deliveryDate: "Mar 16, 2024",
    status: "PENDING",
    total: "$147.00",
  },
  {
    id: "BIRD-GHI789",
    customer: "Michael Brown",
    clubSet: "Tour Set",
    deliveryDate: "Mar 14, 2024",
    status: "DELIVERED",
    total: "$387.00",
  },
  {
    id: "BIRD-JKL012",
    customer: "Emily Davis",
    clubSet: "Premium Set",
    deliveryDate: "Mar 17, 2024",
    status: "CONFIRMED",
    total: "$237.00",
  },
  {
    id: "BIRD-MNO345",
    customer: "David Wilson",
    clubSet: "Standard Set",
    deliveryDate: "Mar 15, 2024",
    status: "OUT_FOR_DELIVERY",
    total: "$147.00",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "bookings":
        return <BookingsTable />
      case "inventory":
        return <InventoryManager />
      case "customers":
        return <CustomerList />
      case "payments":
        return <PaymentOverview />
      case "deliveries":
        return <DeliverySchedule />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Birdie Admin</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  setIsMobileMenuOpen(false)
                }} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-screen sticky top-0">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function Sidebar({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string
  onTabChange: (tab: string) => void 
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-golf-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Birdie Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === item.id
                  ? "bg-golf-green text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">A</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Admin User</p>
            <p className="text-sm text-gray-500">admin@birdie.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your golf rental business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-golf-green" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Club Set</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Delivery</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.id}</td>
                    <td className="py-3 px-4">{booking.customer}</td>
                    <td className="py-3 px-4">{booking.clubSet}</td>
                    <td className="py-3 px-4">{booking.deliveryDate}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          booking.status === "CONFIRMED" ? "default" :
                          booking.status === "DELIVERED" ? "success" :
                          booking.status === "PENDING" ? "warning" :
                          booking.status === "OUT_FOR_DELIVERY" ? "info" :
                          "secondary"
                        }
                      >
                        {booking.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{booking.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Today&apos;s Deliveries</h3>
            <p className="text-3xl font-bold text-golf-green">8</p>
            <p className="text-sm text-gray-500 mt-1">Scheduled for today</p>
            <Button className="w-full mt-4" variant="outline">View Schedule</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Available Inventory</h3>
            <p className="text-3xl font-bold text-blue-600">45</p>
            <p className="text-sm text-gray-500 mt-1">Sets ready to rent</p>
            <Button className="w-full mt-4" variant="outline">Manage Inventory</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Pending Returns</h3>
            <p className="text-3xl font-bold text-amber-600">12</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting pickup</p>
            <Button className="w-full mt-4" variant="outline">View Returns</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
