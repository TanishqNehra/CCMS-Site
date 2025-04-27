"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useApp } from "@/context/app-context"

interface NewTruckModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewTruckModal({ isOpen, onClose }: NewTruckModalProps) {
  const { toast } = useToast()
  const { addTruck } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    driver: "",
    type: "",
    capacity: "",
    licensePlate: "",
    location: "",
    status: "available",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!formData.driver || !formData.type || !formData.capacity || !formData.licensePlate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Add the new truck to our database
      await addTruck({
        driver: formData.driver,
        type: formData.type,
        capacity: formData.capacity,
        location: formData.location || "New York, NY",
        status: formData.status,
      })

      toast({
        title: "Truck added",
        description: "Your truck has been added successfully",
      })

      // Reset form and close modal
      setFormData({
        driver: "",
        type: "",
        capacity: "",
        licensePlate: "",
        location: "",
        status: "available",
      })
      onClose()
    } catch (error) {
      console.error("Error adding truck:", error)
      toast({
        title: "Error adding truck",
        description: "There was an error adding the truck. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Truck</DialogTitle>
          <DialogDescription>Enter the details to add a new truck to the fleet</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name</Label>
            <Input
              id="driver"
              placeholder="Enter driver name"
              value={formData.driver}
              onChange={(e) => handleChange("driver", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Truck Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delivery Van">Delivery Van</SelectItem>
                <SelectItem value="Box Truck">Box Truck</SelectItem>
                <SelectItem value="Semi-Trailer">Semi-Trailer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (kg)</Label>
            <Input
              id="capacity"
              type="text"
              placeholder="Enter capacity"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input
              id="licensePlate"
              placeholder="Enter license plate"
              value={formData.licensePlate}
              onChange={(e) => handleChange("licensePlate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                <SelectItem value="Boston, MA">Boston, MA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Truck"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
