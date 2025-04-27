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
import { Loader2, Package, Truck, MapPin, Calendar, User, Phone, Mail, Info, CheckCircle } from "lucide-react"
import { useApp } from "@/context/app-context"

interface ConsignmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  consignmentId: string
}

export default function ConsignmentDetailsModal({ isOpen, onClose, consignmentId }: ConsignmentDetailsModalProps) {
  const { consignments, trucks, isLoading } = useApp()
  const [consignment, setConsignment] = useState<any>(null)
  const [assignedTruck, setAssignedTruck] = useState<any>(null)

  useEffect(() => {
    if (consignmentId && consignments.length > 0) {
      const found = consignments.find((c) => c.id === consignmentId)
      setConsignment(found || null)

      if (found?.truck_id && trucks.length > 0) {
        const truck = trucks.find((t) => t.id === found.truck_id)
        setAssignedTruck(truck || null)
      } else {
        setAssignedTruck(null)
      }
    }
  }, [consignmentId, consignments, trucks])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consignment Details</DialogTitle>
          <DialogDescription>Detailed information about this consignment</DialogDescription>
        </DialogHeader>

        {isLoading || !consignment ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{consignment.id}</h3>
                <p className="text-sm text-muted-foreground">Created on {consignment.date}</p>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${consignment.status === "pending" ? "bg-blue-50 text-blue-700" : ""}
                  ${consignment.status === "in-transit" ? "bg-amber-50 text-amber-700" : ""}
                  ${consignment.status === "delivered" ? "bg-green-50 text-green-700" : ""}
                `}
              >
                {consignment.status === "pending" && "Pending"}
                {consignment.status === "in-transit" && "In Transit"}
                {consignment.status === "delivered" && "Delivered"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Consignment Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Type:</span> {consignment.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Weight:</span> {consignment.weight}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Destination:</span> {consignment.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Date:</span> {consignment.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Name:</span> {consignment.customer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Contact:</span> {consignment.contact || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Email:</span> {consignment.email || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {assignedTruck && (
              <div className="border rounded-md p-4 bg-muted/20">
                <h4 className="font-medium mb-3">Assigned Truck</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">ID:</span> {assignedTruck.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Driver:</span> {assignedTruck.driver}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Type:</span> {assignedTruck.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Location:</span> {assignedTruck.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Tracking History</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Consignment Created</p>
                    <p className="text-sm text-muted-foreground">{consignment.date}</p>
                  </div>
                </div>

                {consignment.status === "in-transit" || consignment.status === "delivered" ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full">
                      <Truck className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-muted-foreground">
                        Truck {consignment.truck_id} assigned for delivery
                      </p>
                    </div>
                  </div>
                ) : null}

                {consignment.status === "delivered" ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">Consignment successfully delivered</p>
                    </div>
                  </div>
                ) : null}
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
