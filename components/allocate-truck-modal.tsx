"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useApp } from "@/context/app-context"

interface AllocateTruckModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  consignmentId: string
}

export default function AllocateTruckModal({ isOpen, onClose, onSuccess, consignmentId }: AllocateTruckModalProps) {
  const { toast } = useToast()
  const { trucks, allocateTruck, isLoading } = useApp()
  const [selectedTruckId, setSelectedTruckId] = useState<string>("")
  const [availableTrucks, setAvailableTrucks] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter available trucks
  useEffect(() => {
    if (trucks) {
      const available = trucks.filter((truck) => truck.status === "available")
      setAvailableTrucks(available)

      // Reset selection if previously selected truck is no longer available
      if (selectedTruckId && !available.some((truck) => truck.id === selectedTruckId)) {
        setSelectedTruckId("")
      }

      // Auto-select the first available truck if none selected
      if (available.length > 0 && !selectedTruckId) {
        setSelectedTruckId(available[0].id)
      }
    }
  }, [trucks, selectedTruckId])

  // Reset error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!selectedTruckId) {
      toast({
        title: "No truck selected",
        description: "Please select a truck to allocate",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await allocateTruck(consignmentId, selectedTruckId)

      toast({
        title: "Truck allocated successfully",
        description: `Truck ${selectedTruckId} has been allocated to consignment ${consignmentId}`,
      })

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        onClose()
      }
    } catch (error) {
      console.error("Error allocating truck:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Error allocating truck",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Allocate Truck</DialogTitle>
          <DialogDescription>Select a truck to allocate to consignment {consignmentId}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : availableTrucks.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No available trucks found.</p>
            <p className="text-sm text-muted-foreground mt-2">All trucks are currently allocated or in maintenance.</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="truck">Select Truck</Label>
              <Select value={selectedTruckId} onValueChange={setSelectedTruckId}>
                <SelectTrigger id="truck">
                  <SelectValue placeholder="Select a truck" />
                </SelectTrigger>
                <SelectContent>
                  {availableTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.id} - {truck.type} ({truck.driver})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTruckId && (
              <div className="border rounded-md p-3 bg-muted/30">
                <h4 className="font-medium mb-2">Truck Details</h4>
                {availableTrucks
                  .filter((t) => t.id === selectedTruckId)
                  .map((truck) => (
                    <div key={truck.id} className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Driver:</span> {truck.driver}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {truck.type}
                      </p>
                      <p>
                        <span className="font-medium">Capacity:</span> {truck.capacity}
                      </p>
                      <p>
                        <span className="font-medium">Current Location:</span> {truck.location}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || availableTrucks.length === 0 || !selectedTruckId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Allocating...
              </>
            ) : (
              "Allocate Truck"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
