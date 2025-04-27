"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

interface NewConsignmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewConsignmentModal({ isOpen, onClose }: NewConsignmentModalProps) {
  const { toast } = useToast()
  const { addConsignment } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    origin: "",
    destination: "",
    customer: "",
    contact: "",
    email: "",
    isExpress: false,
    isInsured: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!formData.type || !formData.weight || !formData.destination || !formData.customer) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Add the new consignment to our database
      await addConsignment({
        customer: formData.customer,
        type: formData.type,
        weight: formData.weight,
        destination: formData.destination,
        status: "pending",
      })

      toast({
        title: "Consignment created",
        description: "Your consignment has been created successfully",
      })

      // Reset form and close modal
      setFormData({
        type: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        origin: "",
        destination: "",
        customer: "",
        contact: "",
        email: "",
        isExpress: false,
        isInsured: false,
      })
      onClose()
    } catch (error) {
      console.error("Error creating consignment:", error)
      toast({
        title: "Error creating consignment",
        description: "There was an error creating the consignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Consignment</DialogTitle>
          <DialogDescription>Enter the details to create a new consignment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Consignment Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parcel">Parcel</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="freight">Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                placeholder="Enter length"
                value={formData.length}
                onChange={(e) => handleChange("length", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter width"
                value={formData.width}
                onChange={(e) => handleChange("width", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Select value={formData.origin} onValueChange={(value) => handleChange("origin", value)}>
              <SelectTrigger id="origin">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-york">New York Branch</SelectItem>
                <SelectItem value="chicago">Chicago Branch</SelectItem>
                <SelectItem value="los-angeles">Los Angeles Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              placeholder="Enter customer name"
              value={formData.customer}
              onChange={(e) => handleChange("customer", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="express"
              checked={formData.isExpress}
              onCheckedChange={(checked) => handleChange("isExpress", Boolean(checked))}
            />
            <Label htmlFor="express">Express Delivery</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="insurance"
              checked={formData.isInsured}
              onCheckedChange={(checked) => handleChange("isInsured", Boolean(checked))}
            />
            <Label htmlFor="insurance">Add Insurance</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Consignment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
