"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MapPin, PenToolIcon as Tool, Loader2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useApp } from "@/context/app-context"
import { useState } from "react"
import TruckDetailsModal from "./truck-details-modal"

interface TruckTableProps {
  status?: string
}

export default function TruckTable({ status }: TruckTableProps) {
  const { toast } = useToast()
  const { trucks, isLoading, markTruckAvailable } = useApp()
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const filteredTrucks = status ? trucks.filter((truck) => truck.status === status) : trucks

  const handleView = (id: string) => {
    setSelectedTruckId(id)
    setIsDetailsModalOpen(true)
  }

  const handleTrack = (id: string) => {
    toast({
      title: "Tracking truck",
      description: `Tracking location for truck ${id}`,
    })
  }

  const handleMaintenance = async (id: string) => {
    setIsUpdating(id)
    try {
      await markTruckAvailable(id)
      toast({
        title: "Truck status updated",
        description: `Truck ${id} is now available`,
      })
    } catch (error) {
      console.error("Error updating truck status:", error)
      toast({
        title: "Error updating truck",
        description: "There was an error updating the truck status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading trucks...</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Truck ID</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Current Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Consignment</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrucks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No trucks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTrucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{truck.id}</TableCell>
                  <TableCell>{truck.driver}</TableCell>
                  <TableCell>{truck.type}</TableCell>
                  <TableCell>{truck.capacity}</TableCell>
                  <TableCell>{truck.location}</TableCell>
                  <TableCell>
                    {truck.status === "available" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Available
                      </Badge>
                    )}
                    {truck.status === "in-transit" && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        In Transit
                      </Badge>
                    )}
                    {truck.status === "maintenance" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        Maintenance
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {truck.assignedConsignmentId ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                        <Package className="h-3 w-3 mr-1 inline" />
                        {truck.assignedConsignmentId}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>{truck.last_maintenance}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(truck.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleTrack(truck.id)}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                      {truck.status === "in-transit" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMaintenance(truck.id)}
                          disabled={isUpdating === truck.id}
                        >
                          {isUpdating === truck.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Tool className="h-4 w-4" />
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

      {selectedTruckId && (
        <TruckDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          truckId={selectedTruckId}
        />
      )}
    </>
  )
}
