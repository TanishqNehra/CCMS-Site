"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import * as api from "@/lib/api"

type Consignment = {
  id: string
  customer: string
  type: string
  weight: string
  destination: string
  status: string
  date: string
  truckId?: string | null
  contact?: string
  email?: string
  createdAt?: string
  updatedAt?: string
}

type Truck = {
  id: string
  driver: string
  type: string
  capacity: string
  location: string
  status: string
  lastMaintenance: string
  assignedConsignmentId?: string | null
  createdAt?: string
  updatedAt?: string
}

// Define localStorage keys
const STORAGE_KEYS = {
  TRUCK_ASSIGNMENTS: "courier_truck_assignments",
  CONSIGNMENT_STATUSES: "courier_consignment_statuses",
  TRUCK_STATUSES: "courier_truck_statuses",
}

type TruckAssignment = {
  consignmentId: string
  truckId: string
}

type ConsignmentStatus = {
  id: string
  status: string
  truckId: string | null
}

type TruckStatus = {
  id: string
  status: string
  assignedConsignmentId: string | null
}

type AppContextType = {
  consignments: Consignment[]
  trucks: Truck[]
  isLoading: boolean
  addConsignment: (consignment: Omit<Consignment, "id" | "date" | "status">) => Promise<void>
  addTruck: (truck: Omit<Truck, "id" | "lastMaintenance" | "status">) => Promise<void>
  allocateTruck: (consignmentId: string, truckId: string) => Promise<void>
  markConsignmentDelivered: (consignmentId: string) => Promise<void>
  markTruckAvailable: (truckId: string) => Promise<void>
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [consignments, setConsignments] = useState<Consignment[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Helper functions for localStorage
  const getStoredTruckAssignments = (): TruckAssignment[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.TRUCK_ASSIGNMENTS)
    return stored ? JSON.parse(stored) : []
  }

  const getStoredConsignmentStatuses = (): ConsignmentStatus[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.CONSIGNMENT_STATUSES)
    return stored ? JSON.parse(stored) : []
  }

  const getStoredTruckStatuses = (): TruckStatus[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.TRUCK_STATUSES)
    return stored ? JSON.parse(stored) : []
  }

  const storeAssignment = (consignmentId: string, truckId: string) => {
    if (typeof window === "undefined") return

    // Store truck assignment
    const assignments = getStoredTruckAssignments()
    const existingIndex = assignments.findIndex((a) => a.consignmentId === consignmentId)

    if (existingIndex >= 0) {
      assignments[existingIndex].truckId = truckId
    } else {
      assignments.push({ consignmentId, truckId })
    }

    localStorage.setItem(STORAGE_KEYS.TRUCK_ASSIGNMENTS, JSON.stringify(assignments))

    // Store consignment status
    const consignmentStatuses = getStoredConsignmentStatuses()
    const existingConsignmentIndex = consignmentStatuses.findIndex((c) => c.id === consignmentId)

    if (existingConsignmentIndex >= 0) {
      consignmentStatuses[existingConsignmentIndex].status = "in-transit"
      consignmentStatuses[existingConsignmentIndex].truckId = truckId
    } else {
      consignmentStatuses.push({ id: consignmentId, status: "in-transit", truckId })
    }

    localStorage.setItem(STORAGE_KEYS.CONSIGNMENT_STATUSES, JSON.stringify(consignmentStatuses))

    // Store truck status
    const truckStatuses = getStoredTruckStatuses()
    const existingTruckIndex = truckStatuses.findIndex((t) => t.id === truckId)

    if (existingTruckIndex >= 0) {
      truckStatuses[existingTruckIndex].status = "in-transit"
      truckStatuses[existingTruckIndex].assignedConsignmentId = consignmentId
    } else {
      truckStatuses.push({ id: truckId, status: "in-transit", assignedConsignmentId: consignmentId })
    }

    localStorage.setItem(STORAGE_KEYS.TRUCK_STATUSES, JSON.stringify(truckStatuses))
  }

  const storeConsignmentDelivered = (consignmentId: string) => {
    if (typeof window === "undefined") return

    // Get the truck ID from the assignment
    const assignments = getStoredTruckAssignments()
    const assignment = assignments.find((a) => a.consignmentId === consignmentId)
    const truckId = assignment?.truckId

    // Remove the assignment
    const updatedAssignments = assignments.filter((a) => a.consignmentId !== consignmentId)
    localStorage.setItem(STORAGE_KEYS.TRUCK_ASSIGNMENTS, JSON.stringify(updatedAssignments))

    // Update consignment status
    const consignmentStatuses = getStoredConsignmentStatuses()
    const existingConsignmentIndex = consignmentStatuses.findIndex((c) => c.id === consignmentId)

    if (existingConsignmentIndex >= 0) {
      consignmentStatuses[existingConsignmentIndex].status = "delivered"
      consignmentStatuses[existingConsignmentIndex].truckId = null
    } else {
      consignmentStatuses.push({ id: consignmentId, status: "delivered", truckId: null })
    }

    localStorage.setItem(STORAGE_KEYS.CONSIGNMENT_STATUSES, JSON.stringify(consignmentStatuses))

    // Update truck status if we have a truck ID
    if (truckId) {
      const truckStatuses = getStoredTruckStatuses()
      const existingTruckIndex = truckStatuses.findIndex((t) => t.id === truckId)

      if (existingTruckIndex >= 0) {
        truckStatuses[existingTruckIndex].status = "available"
        truckStatuses[existingTruckIndex].assignedConsignmentId = null
      } else {
        truckStatuses.push({ id: truckId, status: "available", assignedConsignmentId: null })
      }

      localStorage.setItem(STORAGE_KEYS.TRUCK_STATUSES, JSON.stringify(truckStatuses))
    }
  }

  const storeTruckAvailable = (truckId: string) => {
    if (typeof window === "undefined") return

    // Get the consignment ID from the assignment
    const assignments = getStoredTruckAssignments()
    const assignment = assignments.find((a) => a.truckId === truckId)
    const consignmentId = assignment?.consignmentId

    // Remove the assignment if it exists
    if (consignmentId) {
      const updatedAssignments = assignments.filter((a) => a.truckId !== truckId)
      localStorage.setItem(STORAGE_KEYS.TRUCK_ASSIGNMENTS, JSON.stringify(updatedAssignments))
    }

    // Update truck status
    const truckStatuses = getStoredTruckStatuses()
    const existingTruckIndex = truckStatuses.findIndex((t) => t.id === truckId)

    if (existingTruckIndex >= 0) {
      truckStatuses[existingTruckIndex].status = "available"
      truckStatuses[existingTruckIndex].assignedConsignmentId = null
    } else {
      truckStatuses.push({ id: truckId, status: "available", assignedConsignmentId: null })
    }

    localStorage.setItem(STORAGE_KEYS.TRUCK_STATUSES, JSON.stringify(truckStatuses))

    // Update consignment status if we have a consignment ID
    if (consignmentId) {
      const consignmentStatuses = getStoredConsignmentStatuses()
      const existingConsignmentIndex = consignmentStatuses.findIndex((c) => c.id === consignmentId)

      if (existingConsignmentIndex >= 0) {
        consignmentStatuses[existingConsignmentIndex].status = "pending"
        consignmentStatuses[existingConsignmentIndex].truckId = null
      } else {
        consignmentStatuses.push({ id: consignmentId, status: "pending", truckId: null })
      }

      localStorage.setItem(STORAGE_KEYS.CONSIGNMENT_STATUSES, JSON.stringify(consignmentStatuses))
    }
  }

  // Apply stored statuses to the data
  const applyStoredStatuses = (consignmentsData: Consignment[], trucksData: Truck[]) => {
    const consignmentStatuses = getStoredConsignmentStatuses()
    const truckStatuses = getStoredTruckStatuses()
    const assignments = getStoredTruckAssignments()

    // Apply consignment statuses and truck assignments
    const updatedConsignments = consignmentsData.map((consignment) => {
      const storedStatus = consignmentStatuses.find((c) => c.id === consignment.id)
      const assignment = assignments.find((a) => a.consignmentId === consignment.id)

      if (storedStatus) {
        return {
          ...consignment,
          status: storedStatus.status,
          truckId: storedStatus.truckId,
        }
      } else if (assignment) {
        return {
          ...consignment,
          status: "in-transit",
          truckId: assignment.truckId,
        }
      }

      return consignment
    })

    // Apply truck statuses and consignment assignments
    const updatedTrucks = trucksData.map((truck) => {
      const storedStatus = truckStatuses.find((t) => t.id === truck.id)
      const assignment = assignments.find((a) => a.truckId === truck.id)

      if (storedStatus) {
        return {
          ...truck,
          status: storedStatus.status,
          assignedConsignmentId: storedStatus.assignedConsignmentId,
        }
      } else if (assignment) {
        return {
          ...truck,
          status: "in-transit",
          assignedConsignmentId: assignment.consignmentId,
        }
      }

      return truck
    })

    return { updatedConsignments, updatedTrucks }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch consignments
      const consignmentsData = await api.getConsignments()

      // Fetch trucks
      const trucksData = await api.getTrucks()

      // Apply stored statuses from localStorage
      const { updatedConsignments, updatedTrucks } = applyStoredStatuses(consignmentsData || [], trucksData || [])

      console.log("Fetched and updated consignments:", updatedConsignments)
      console.log("Fetched and updated trucks:", updatedTrucks)

      setConsignments(updatedConsignments)
      setTrucks(updatedTrucks)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error fetching data",
        description: "There was an error loading the data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  const addConsignment = async (consignment: Omit<Consignment, "id" | "date" | "status">) => {
    try {
      await api.createConsignment(consignment)

      // Refresh data after adding
      await fetchData()

      return Promise.resolve()
    } catch (error) {
      console.error("Error adding consignment:", error)
      toast({
        title: "Error adding consignment",
        description: "There was an error adding the consignment. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const addTruck = async (truck: Omit<Truck, "id" | "lastMaintenance" | "status">) => {
    try {
      await api.createTruck(truck)

      // Refresh data after adding
      await fetchData()

      return Promise.resolve()
    } catch (error) {
      console.error("Error adding truck:", error)
      toast({
        title: "Error adding truck",
        description: "There was an error adding the truck. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const allocateTruck = async (consignmentId: string, truckId: string) => {
    try {
      // First, check if the truck is available using local state
      const truck = trucks.find((t) => t.id === truckId)
      const consignment = consignments.find((c) => c.id === consignmentId)

      if (!truck) {
        throw new Error("Selected truck not found")
      }

      if (!consignment) {
        throw new Error("Consignment not found")
      }

      if (truck.status !== "available") {
        throw new Error("Selected truck is not available")
      }

      console.log("Starting allocation process for consignment:", consignmentId, "with truck:", truckId)

      // Store the assignment in localStorage
      storeAssignment(consignmentId, truckId)

      // Try to call the API to allocate the truck (but don't rely on it)
      try {
        await api.allocateTruck(consignmentId, truckId)
      } catch (apiError) {
        console.warn("API call failed, but continuing with local state update:", apiError)
      }

      // Immediately update local state to reflect changes
      const updatedConsignments = consignments.map((c) => {
        if (c.id === consignmentId) {
          console.log("Updating consignment in state:", { ...c, status: "in-transit", truckId })
          return { ...c, status: "in-transit", truckId }
        }
        return c
      })

      const updatedTrucks = trucks.map((t) => {
        if (t.id === truckId) {
          console.log("Updating truck in state:", { ...t, status: "in-transit", assignedConsignmentId: consignmentId })
          return { ...t, status: "in-transit", assignedConsignmentId: consignmentId }
        }
        return t
      })

      setConsignments(updatedConsignments)
      setTrucks(updatedTrucks)

      toast({
        title: "Truck allocated",
        description: `Truck ${truckId} has been allocated to consignment ${consignmentId}`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error allocating truck:", error)
      toast({
        title: "Error allocating truck",
        description:
          error instanceof Error ? error.message : "There was an error allocating the truck. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const markConsignmentDelivered = async (consignmentId: string) => {
    try {
      // Find the consignment in our local state to get the truck_id
      const consignment = consignments.find((c) => c.id === consignmentId)
      if (!consignment) {
        throw new Error("Consignment not found")
      }

      console.log("Marking consignment as delivered:", consignmentId)

      // Store the delivery status in localStorage
      storeConsignmentDelivered(consignmentId)

      // Try to call the API to mark the consignment as delivered (but don't rely on it)
      try {
        await api.markConsignmentDelivered(consignmentId)
      } catch (apiError) {
        console.warn("API call failed, but continuing with local state update:", apiError)
      }

      // Immediately update local state
      const updatedConsignments = consignments.map((c) => {
        if (c.id === consignmentId) {
          return { ...c, status: "delivered", truckId: null }
        }
        return c
      })

      // If there's an assigned truck, update its status in local state
      if (consignment.truckId) {
        const updatedTrucks = trucks.map((t) => {
          if (t.id === consignment.truckId) {
            return { ...t, status: "available", assignedConsignmentId: null }
          }
          return t
        })
        setTrucks(updatedTrucks)
      }

      setConsignments(updatedConsignments)

      toast({
        title: "Consignment delivered",
        description: `Consignment ${consignmentId} has been marked as delivered`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error marking consignment as delivered:", error)
      toast({
        title: "Error updating consignment",
        description:
          error instanceof Error
            ? error.message
            : "There was an error marking the consignment as delivered. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const markTruckAvailable = async (truckId: string) => {
    try {
      // Find the truck in our local state to get the assigned_consignment_id
      const truck = trucks.find((t) => t.id === truckId)
      if (!truck) {
        throw new Error("Truck not found")
      }

      console.log("Marking truck as available:", truckId)

      // Store the truck status in localStorage
      storeTruckAvailable(truckId)

      // Try to call the API to mark the truck as available (but don't rely on it)
      try {
        await api.markTruckAvailable(truckId)
      } catch (apiError) {
        console.warn("API call failed, but continuing with local state update:", apiError)
      }

      // Immediately update local state
      const updatedTrucks = trucks.map((t) => {
        if (t.id === truckId) {
          return { ...t, status: "available", assignedConsignmentId: null }
        }
        return t
      })

      // If there's an assigned consignment, update its status in local state
      if (truck.assignedConsignmentId) {
        const updatedConsignments = consignments.map((c) => {
          if (c.id === truck.assignedConsignmentId) {
            return { ...c, status: "pending", truckId: null }
          }
          return c
        })
        setConsignments(updatedConsignments)
      }

      setTrucks(updatedTrucks)

      toast({
        title: "Truck available",
        description: `Truck ${truckId} has been marked as available`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error marking truck as available:", error)
      toast({
        title: "Error updating truck",
        description:
          error instanceof Error
            ? error.message
            : "There was an error marking the truck as available. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        consignments,
        trucks,
        isLoading,
        addConsignment,
        addTruck,
        allocateTruck,
        markConsignmentDelivered,
        markTruckAvailable,
        refreshData: fetchData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
