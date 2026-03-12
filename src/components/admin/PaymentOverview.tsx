"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, CreditCard, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock payment data
const mockPayments = [
  {
    id: "PAY-001",
    bookingId: "BIRD-ABC123",
    customer: "John Smith",
    amount: 237.00,
    status: "PAID",
    method: "Credit Card",
    lastFour: "4242",
    date: "Mar 12, 2024",
  },
  {
    id: "PAY-002",
    bookingId: "BIRD-DEF456",
    customer: "Sarah Johnson",
    amount: 147.00,
    status: "PENDING",
    method: "Credit Card",
    lastFour: "8888",
    date: "Mar 13, 2024",
  },
  {
    id: "PAY-003",
    bookingId: "BIRD-GHI789",
    customer: "Michael Brown",
    amount: 387.00,
    status: "PAID",
    method: "Apple Pay",
    lastFour: "",
    date: "Mar 11, 2024",
  },
  {
    id: "PAY-004",
    bookingId: "BIRD-JKL012",
    customer: "Emily Davis",
    amount: 237.00,
    status: "PAID",
    method: "Google Pay",
    lastFour: "",
    date: "Mar 13, 2024",
  },
  {
    id: "PAY-005",
    bookingId: "BIRD-MNO345",
    customer: "David Wilson",
    amount: 147.00,
    status: "PAID",
    method: "Credit Card",
    lastFour: "1234",
    date: "Mar 12, 2024",
  },
]

const mockRefunds = [
  {
    id: "REF-001",
    bookingId: "BIRD-PQR678",
    customer: "Lisa Anderson",
    amount: 237.00,
    status: "REFUNDED",
    reason: "Customer cancellation",
    date: "Mar 10, 2024",
  },
]

export function PaymentOverview() {
  const [activeTab, setActiveTab] = useState("payments")

  const totalRevenue = mockPayments
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0)

  const pendingAmount = mockPayments
    .filter((p) => p.status === "PENDING")
    .reduce((acc, p) => acc + p.amount, 0)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      PAID: "success",
      PENDING: "warning",
      FAILED: "destructive",
      REFUNDED: "secondary",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage all payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  ${pendingAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockPayments.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Refunds</p>
                <p className="text-2xl font-bold text-red-600">
                  ${mockRefunds.reduce((acc, r) => acc + r.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600 rotate-180" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">60%</p>
              <p className="text-sm text-gray-500">Credit Card</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">25%</p>
              <p className="text-sm text-gray-500">Apple Pay</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">15%</p>
              <p className="text-sm text-gray-500">Google Pay</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Booking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((payment) => (
                    <tr key={payment.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{payment.id}</td>
                      <td className="py-3 px-4">{payment.bookingId}</td>
                      <td className="py-3 px-4">{payment.customer}</td>
                      <td className="py-3 px-4">
                        {payment.method}
                        {payment.lastFour && (
                          <span className="text-gray-500"> (...{payment.lastFour})</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{payment.date}</td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${payment.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="refunds" className="mt-6">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Refund ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Booking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRefunds.map((refund) => (
                    <tr key={refund.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{refund.id}</td>
                      <td className="py-3 px-4">{refund.bookingId}</td>
                      <td className="py-3 px-4">{refund.customer}</td>
                      <td className="py-3 px-4">{refund.reason}</td>
                      <td className="py-3 px-4">{refund.date}</td>
                      <td className="py-3 px-4">{getStatusBadge(refund.status)}</td>
                      <td className="py-3 px-4 text-right font-medium text-red-600">
                        -${refund.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
