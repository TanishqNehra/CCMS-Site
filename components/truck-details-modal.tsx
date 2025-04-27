"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Truck, User, MapPin, Calendar, Package, Info, Ruler } from "lucide-react"
import { useApp } from "@/context/app-context"

interface TruckDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  truckId: string
}

export default function TruckDetailsModal({ isOpen, onClose, truckId }: TruckDetailsModalProps) {
  const { trucks, consignments, isLoading } = useApp()
  const [truck, setTruck] = useState<any>(null)
  const [assignedConsignment, setAssignedConsignment] = useState<any>(null)

  useEffect(() => {
    if (truckId && trucks.length > 0) {
      const found = trucks.find((t) => t.id === truckId)
      setTruck(found || null)

      if (found?.assigned_consignment_id && consignments.length > 0) {
        const consignment = consignments.find((c) => c.id === found.assigned_consignment_id)
        setAssignedConsignment(consignment || null)
      } else {
        setAssignedConsignment(null)
      }
    }
  }, [truckId, trucks, consignments])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Truck Details</DialogTitle>
          <DialogDescription>Detailed information about this truck</DialogDescription>
        </DialogHeader>

        {isLoading || !truck ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{truck.id}</h3>
                <p className="text-sm text-muted-foreground">Last maintenance: {truck.last_maintenance}</p>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${truck.status === "available" ? "bg-green-50 text-green-700" : ""}
                  ${truck.status === "in-transit" ? "bg-amber-50 text-amber-700" : ""}
                  ${truck.status === "maintenance" ? "bg-red-50 text-red-700" : ""}
                `}
              >
                {truck.status === "available" && "Available"}
                {truck.status === "in-transit" && "In Transit"}
                {truck.status === "maintenance" && "Maintenance"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Truck Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Type:</span> {truck.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Capacity:</span> {truck.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Current Location:</span> {truck.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Last Maintenance:</span> {truck.last_maintenance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Driver Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Name:</span> {truck.driver}
                    </span>
                  </div>
                  {/* Additional driver information would go here */}
                </div>
              </div>
            </div>

            {assignedConsignment && (
              <div className="border rounded-md p-4 bg-muted/20">
                <h4 className="font-medium mb-3">Assigned Consignment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">ID:</span> {assignedConsignment.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Customer:</span> {assignedConsignment.customer}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Type:</span> {assignedConsignment.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Destination:</span> {assignedConsignment.destination}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Activity History</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Truck Added to Fleet</p>
                    <p className="text-sm text-muted-foreground">Initial registration</p>
                  </div>
                </div>

                {truck.status === "in-transit" && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Assigned to Consignment</p>
                      <p className="text-sm text-muted-foreground">
                        Currently delivering consignment {truck.assigned_consignment_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
