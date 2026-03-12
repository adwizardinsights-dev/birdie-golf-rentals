"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock inventory data
const mockInventory = [
  {
    id: "1",
    name: "Standard Set",
    tier: "STANDARD",
    brand: "Callaway",
    model: "Strata",
    totalQuantity: 20,
    available: 15,
    rented: 3,
    maintenance: 2,
    pricePerDay: 49,
  },
  {
    id: "2",
    name: "Premium Set",
    tier: "PREMIUM",
    brand: "TaylorMade",
    model: "Stealth",
    totalQuantity: 15,
    available: 8,
    rented: 5,
    maintenance: 2,
    pricePerDay: 79,
  },
  {
    id: "3",
    name: "Tour Set",
    tier: "TOUR",
    brand: "Titleist",
    model: "TSR",
    totalQuantity: 10,
    available: 4,
    rented: 5,
    maintenance: 1,
    pricePerDay: 129,
  },
]

const mockLocations = [
  { id: "1", name: "Miami Central", address: "Downtown Miami" },
  { id: "2", name: "Miami Beach", address: "South Beach" },
  { id: "3", name: "Doral", address: "Near Trump National" },
]

export function InventoryManager() {
  const [inventory, setInventory] = useState(mockInventory)
  const [editingItem, setEditingItem] = useState<typeof mockInventory[0] | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getStockStatus = (available: number, total: number) => {
    const ratio = available / total
    if (ratio < 0.2) return { label: "Low Stock", variant: "destructive" as const }
    if (ratio < 0.5) return { label: "Medium", variant: "warning" as const }
    return { label: "Good", variant: "success" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage your golf club inventory</p>
        </div>
        <Button 
          className="bg-golf-green hover:bg-golf-green-dark"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Club Set
        </Button>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sets</p>
                <p className="text-3xl font-bold text-gray-900">
                  {inventory.reduce((acc, item) => acc + item.totalQuantity, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {inventory.reduce((acc, item) => acc + item.available, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Currently Rented</p>
                <p className="text-3xl font-bold text-amber-600">
                  {inventory.reduce((acc, item) => acc + item.rented, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Club Set</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Tier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Available</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rented</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Price/Day</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const status = getStockStatus(item.available, item.totalQuantity)
                return (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.brand} {item.model}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.tier}</Badge>
                    </td>
                    <td className="py-3 px-4">{item.totalQuantity}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">{item.available}</span>
                    </td>
                    <td className="py-3 px-4">{item.rented}</td>
                    <td className="py-3 px-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${item.pricePerDay}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Locations Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockLocations.map((location) => (
            <Card key={location.id}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {inventory.some((item) => item.available / item.totalQuantity < 0.2) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Low Stock Alert</p>
            <p className="text-sm text-red-600">
              Some club sets are running low on inventory. Consider restocking soon.
            </p>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Club Set</label>
                <Input value={editingItem.name} disabled className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Total Quantity</label>
                  <Input 
                    type="number" 
                    defaultValue={editingItem.totalQuantity}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price per Day</label>
                  <Input 
                    type="number" 
                    defaultValue={editingItem.pricePerDay}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button className="bg-golf-green hover:bg-golf-green-dark">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
