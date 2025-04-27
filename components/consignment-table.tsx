"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Truck, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useApp } from "@/context/app-context"
import AllocateTruckModal from "./allocate-truck-modal"
import ConsignmentDetailsModal from "./consignment-details-modal"

interface ConsignmentTableProps {
  status?: string
}

export default function ConsignmentTable({ status }: ConsignmentTableProps) {
  const { toast } = useToast()
  const { consignments, isLoading, markConsignmentDelivered } = useApp()
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string | null>(null)
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isMarkingDelivered, setIsMarkingDelivered] = useState<string | null>(null)

  // Filter consignments based on the status prop
  const filteredConsignments = status
    ? consignments.filter((consignment) => consignment.status === status)
    : consignments

  const handleView = (id: string) => {
    setSelectedConsignmentId(id)
    setIsDetailsModalOpen(true)
  }

  const handleAssignTruck = (id: string) => {
    setSelectedConsignmentId(id)
    setIsAllocateModalOpen(true)
  }

  const handleMarkDelivered = async (id: string) => {
    setIsMarkingDelivered(id)
    try {
      await markConsignmentDelivered(id)
      toast({
        title: "Success",
        description: `Consignment ${id} has been marked as delivered`,
      })
    } catch (error) {
      console.error("Error marking consignment as delivered:", error)
      toast({
        title: "Error",
        description: "Failed to mark consignment as delivered. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMarkingDelivered(null)
    }
  }

  const handleAllocateSuccess = () => {
    setIsAllocateModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading consignments...</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Assigned Truck</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No consignments found
                </TableCell>
              </TableRow>
            ) : (
              filteredConsignments.map((consignment) => (
                <TableRow key={consignment.id}>
                  <TableCell className="font-medium">{consignment.id}</TableCell>
                  <TableCell>{consignment.customer}</TableCell>
                  <TableCell>{consignment.type}</TableCell>
                  <TableCell>{consignment.weight}</TableCell>
                  <TableCell>{consignment.destination}</TableCell>
                  <TableCell>
                    {consignment.status === "pending" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Pending
                      </Badge>
                    )}
                    {consignment.status === "in-transit" && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        In Transit
                      </Badge>
                    )}
                    {consignment.status === "delivered" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Delivered
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{consignment.date}</TableCell>
                  <TableCell>
                    {consignment.truckId ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                        {consignment.truckId}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(consignment.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {consignment.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => handleAssignTruck(consignment.id)}>
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                      {consignment.status === "in-transit" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkDelivered(consignment.id)}
                          disabled={isMarkingDelivered === consignment.id}
                        >
                          {isMarkingDelivered === consignment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedConsignmentId && (
        <>
          <AllocateTruckModal
            isOpen={isAllocateModalOpen}
            onClose={() => setIsAllocateModalOpen(false)}
            onSuccess={handleAllocateSuccess}
            consignmentId={selectedConsignmentId}
          />
          <ConsignmentDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            consignmentId={selectedConsignmentId}
          />
        </>
      )}
    </>
  )
}
