import { createBrowserClient } from "@/lib/supabase"

// Define types for our data
export type Consignment = {
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

export type Truck = {
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

// Helper function to simulate API delay for development
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get Supabase client
const getSupabase = () => {
  return createBrowserClient()
}

// Helper function to convert snake_case to camelCase
const snakeToCamel = (obj: any) => {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    acc[camelKey] = snakeToCamel(obj[key])
    return acc
  }, {} as any)
}

// Helper function to convert camelCase to snake_case
const camelToSnake = (obj: any) => {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    acc[snakeKey] = camelToSnake(obj[key])
    return acc
  }, {} as any)
}

// API functions that connect to Supabase
export async function getConsignments(status?: string) {
  try {
    const supabase = getSupabase()
    let query = supabase.from("consignments").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching consignments:", error)
      throw error
    }

    // Convert snake_case to camelCase
    return data ? snakeToCamel(data) : []
  } catch (error) {
    console.error("Failed to fetch consignments:", error)
    // Fallback to sample data if database connection fails
    return getSampleConsignments(status)
  }
}

export async function getTrucks(status?: string) {
  try {
    const supabase = getSupabase()
    let query = supabase.from("trucks").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching trucks:", error)
      throw error
    }

    // Convert snake_case to camelCase
    return data ? snakeToCamel(data) : []
  } catch (error) {
    console.error("Failed to fetch trucks:", error)
    // Fallback to sample data if database connection fails
    return getSampleTrucks(status)
  }
}

export async function createConsignment(consignment: Omit<Consignment, "id" | "date" | "status">) {
  try {
    const supabase = getSupabase()

    const newConsignment = {
      customer: consignment.customer,
      type: consignment.type,
      weight: consignment.weight,
      destination: consignment.destination,
      status: "pending",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      contact: consignment.contact || null,
      email: consignment.email || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("consignments").insert(newConsignment).select()

    if (error) {
      console.error("Error creating consignment:", error)
      throw error
    }

    // Convert snake_case to camelCase
    return data?.[0] ? snakeToCamel(data[0]) : null
  } catch (error) {
    console.error("Failed to create consignment:", error)
    // Fallback to sample data if database connection fails
    return createSampleConsignment(consignment)
  }
}

export async function createTruck(truck: Omit<Truck, "id" | "lastMaintenance" | "status">) {
  try {
    const supabase = getSupabase()

    const newTruck = {
      driver: truck.driver,
      type: truck.type,
      capacity: truck.capacity,
      location: truck.location,
      status: "available",
      last_maintenance: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("trucks").insert(newTruck).select()

    if (error) {
      console.error("Error creating truck:", error)
      throw error
    }

    // Convert snake_case to camelCase
    return data?.[0] ? snakeToCamel(data[0]) : null
  } catch (error) {
    console.error("Failed to create truck:", error)
    // Fallback to sample data if database connection fails
    return createSampleTruck(truck)
  }
}

export async function allocateTruck(consignmentId: string, truckId: string) {
  try {
    const supabase = getSupabase()

    // Start a transaction by using multiple operations
    // Update consignment
    const { error: consignmentError } = await supabase
      .from("consignments")
      .update({
        status: "in-transit",
        truck_id: truckId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consignmentId)

    if (consignmentError) {
      console.error("Error updating consignment:", consignmentError)
      throw consignmentError
    }

    // Update truck
    const { error: truckError } = await supabase
      .from("trucks")
      .update({
        status: "in-transit",
        assigned_consignment_id: consignmentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", truckId)

    if (truckError) {
      console.error("Error updating truck:", truckError)
      throw truckError
    }

    // Fetch the updated records
    const { data: consignment } = await supabase.from("consignments").select("*").eq("id", consignmentId).single()

    const { data: truck } = await supabase.from("trucks").select("*").eq("id", truckId).single()

    // Convert snake_case to camelCase
    return {
      consignment: consignment ? snakeToCamel(consignment) : null,
      truck: truck ? snakeToCamel(truck) : null,
    }
  } catch (error) {
    console.error("Failed to allocate truck:", error)
    // Fallback to sample data if database connection fails
    return allocateSampleTruck(consignmentId, truckId)
  }
}

export async function markConsignmentDelivered(consignmentId: string) {
  try {
    const supabase = getSupabase()

    // First, get the consignment to find the truck
    const { data: consignment, error: fetchError } = await supabase
      .from("consignments")
      .select("*")
      .eq("id", consignmentId)
      .single()

    if (fetchError) {
      console.error("Error fetching consignment:", fetchError)
      throw fetchError
    }

    const truckId = consignment?.truck_id

    // Update consignment
    const { error: consignmentError } = await supabase
      .from("consignments")
      .update({
        status: "delivered",
        truck_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consignmentId)

    if (consignmentError) {
      console.error("Error updating consignment:", consignmentError)
      throw consignmentError
    }

    // Update truck if there is one assigned
    if (truckId) {
      const { error: truckError } = await supabase
        .from("trucks")
        .update({
          status: "available",
          assigned_consignment_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", truckId)

      if (truckError) {
        console.error("Error updating truck:", truckError)
        throw truckError
      }
    }

    // Fetch the updated consignment
    const { data: updatedConsignment } = await supabase
      .from("consignments")
      .select("*")
      .eq("id", consignmentId)
      .single()

    // Convert snake_case to camelCase
    return updatedConsignment ? snakeToCamel(updatedConsignment) : null
  } catch (error) {
    console.error("Failed to mark consignment as delivered:", error)
    // Fallback to sample data if database connection fails
    return markSampleConsignmentDelivered(consignmentId)
  }
}

export async function markTruckAvailable(truckId: string) {
  try {
    const supabase = getSupabase()

    // First, get the truck to find the consignment
    const { data: truck, error: fetchError } = await supabase.from("trucks").select("*").eq("id", truckId).single()

    if (fetchError) {
      console.error("Error fetching truck:", fetchError)
      throw fetchError
    }

    const consignmentId = truck?.assigned_consignment_id

    // Update truck
    const { error: truckError } = await supabase
      .from("trucks")
      .update({
        status: "available",
        assigned_consignment_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", truckId)

    if (truckError) {
      console.error("Error updating truck:", truckError)
      throw truckError
    }

    // Update consignment if there is one assigned
    if (consignmentId) {
      const { error: consignmentError } = await supabase
        .from("consignments")
        .update({
          status: "pending",
          truck_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", consignmentId)

      if (consignmentError) {
        console.error("Error updating consignment:", consignmentError)
        throw consignmentError
      }
    }

    // Fetch the updated truck
    const { data: updatedTruck } = await supabase.from("trucks").select("*").eq("id", truckId).single()

    // Convert snake_case to camelCase
    return updatedTruck ? snakeToCamel(updatedTruck) : null
  } catch (error) {
    console.error("Failed to mark truck as available:", error)
    // Fallback to sample data if database connection fails
    return markSampleTruckAvailable(truckId)
  }
}

// Sample data fallbacks for development and testing
// These functions will only be used if the database connection fails

// Sample data for consignments
export const consignments = [
  {
    id: "CCM1234567",
    customer: "John Doe",
    type: "Parcel",
    weight: "2kg",
    destination: "Chicago, IL",
    status: "pending",
    date: "Apr 11, 2023",
    truckId: null,
  },
  {
    id: "CCM7654321",
    customer: "Jane Smith",
    type: "Package",
    weight: "5kg",
    destination: "Los Angeles, CA",
    status: "pending",
    date: "Apr 12, 2023",
    truckId: null,
  },
  {
    id: "CCM9876543",
    customer: "Robert Johnson",
    type: "Freight",
    weight: "50kg",
    destination: "Miami, FL",
    status: "delivered",
    date: "Apr 10, 2023",
    truckId: null,
  },
  {
    id: "CCM5432167",
    customer: "Sarah Williams",
    type: "Parcel",
    weight: "1kg",
    destination: "Boston, MA",
    status: "pending",
    date: "Apr 12, 2023",
    truckId: null,
  },
  {
    id: "CCM8765432",
    customer: "Michael Brown",
    type: "Package",
    weight: "3kg",
    destination: "Seattle, WA",
    status: "in-transit",
    date: "Apr 11, 2023",
    truckId: "TRK-003",
  },
]

// Sample data for trucks
export const trucks = [
  {
    id: "TRK-001",
    driver: "Michael Johnson",
    type: "Delivery Van",
    capacity: "1000kg",
    location: "New York, NY",
    status: "available",
    lastMaintenance: "Apr 05, 2023",
    assignedConsignmentId: null,
  },
  {
    id: "TRK-002",
    driver: "Sarah Davis",
    type: "Box Truck",
    capacity: "3000kg",
    location: "Chicago, IL",
    status: "available",
    lastMaintenance: "Mar 28, 2023",
    assignedConsignmentId: null,
  },
  {
    id: "TRK-003",
    driver: "Robert Wilson",
    type: "Semi-Trailer",
    capacity: "15000kg",
    location: "Los Angeles, CA",
    status: "in-transit",
    lastMaintenance: "Apr 02, 2023",
    assignedConsignmentId: "CCM8765432",
  },
  {
    id: "TRK-004",
    driver: "Emily Brown",
    type: "Delivery Van",
    capacity: "800kg",
    location: "Boston, MA",
    status: "maintenance",
    lastMaintenance: "Apr 10, 2023",
    assignedConsignmentId: null,
  },
  {
    id: "TRK-005",
    driver: "David Miller",
    type: "Box Truck",
    capacity: "2500kg",
    location: "Miami, FL",
    status: "available",
    lastMaintenance: "Mar 25, 2023",
    assignedConsignmentId: null,
  },
]

function getSampleConsignments(status?: string) {
  // Simulate API delay
  return delay(500).then(() => {
    if (status) {
      return consignments.filter((c) => c.status === status)
    }
    return [...consignments]
  })
}

function getSampleTrucks(status?: string) {
  // Simulate API delay
  return delay(500).then(() => {
    if (status) {
      return trucks.filter((t) => t.status === status)
    }
    return [...trucks]
  })
}

function createSampleConsignment(consignment: any) {
  // Simulate API delay
  return delay(500).then(() => {
    const id = `CCM${Math.floor(Math.random() * 10000000)}`
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    const newConsignment = {
      id,
      date,
      status: "pending",
      truckId: null,
      ...consignment,
    }

    consignments.push(newConsignment)
    return newConsignment
  })
}

function createSampleTruck(truck: any) {
  // Simulate API delay
  return delay(500).then(() => {
    const id = `TRK-${Math.floor(Math.random() * 1000)}`
    const lastMaintenance = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const newTruck = {
      id,
      lastMaintenance,
      status: "available",
      assignedConsignmentId: null,
      ...truck,
    }

    trucks.push(newTruck)
    return newTruck
  })
}

function allocateSampleTruck(consignmentId: string, truckId: string) {
  // Simulate API delay
  return delay(500).then(() => {
    const consignmentIndex = consignments.findIndex((c) => c.id === consignmentId)
    const truckIndex = trucks.findIndex((t) => t.id === truckId)

    if (consignmentIndex === -1) throw new Error("Consignment not found")
    if (truckIndex === -1) throw new Error("Truck not found")
    if (trucks[truckIndex].status !== "available") throw new Error("Truck is not available")

    // Update consignment
    consignments[consignmentIndex] = {
      ...consignments[consignmentIndex],
      status: "in-transit",
      truckId: truckId,
    }

    // Update truck
    trucks[truckIndex] = {
      ...trucks[truckIndex],
      status: "in-transit",
      assignedConsignmentId: consignmentId,
    }

    return {
      consignment: consignments[consignmentIndex],
      truck: trucks[truckIndex],
    }
  })
}

function markSampleConsignmentDelivered(consignmentId: string) {
  // Simulate API delay
  return delay(500).then(() => {
    const consignmentIndex = consignments.findIndex((c) => c.id === consignmentId)
    if (consignmentIndex === -1) throw new Error("Consignment not found")

    const truckId = consignments[consignmentIndex].truckId

    // Update consignment
    consignments[consignmentIndex] = {
      ...consignments[consignmentIndex],
      status: "delivered",
      truckId: null,
    }

    // Update truck if there is one assigned
    if (truckId) {
      const truckIndex = trucks.findIndex((t) => t.id === truckId)
      if (truckIndex !== -1) {
        trucks[truckIndex] = {
          ...trucks[truckIndex],
          status: "available",
          assignedConsignmentId: null,
        }
      }
    }

    return consignments[consignmentIndex]
  })
}

function markSampleTruckAvailable(truckId: string) {
  // Simulate API delay
  return delay(500).then(() => {
    const truckIndex = trucks.findIndex((t) => t.id === truckId)
    if (truckIndex === -1) throw new Error("Truck not found")

    const consignmentId = trucks[truckIndex].assignedConsignmentId

    // Update truck
    trucks[truckIndex] = {
      ...trucks[truckIndex],
      status: "available",
      assignedConsignmentId: null,
    }

    // Update consignment if there is one assigned
    if (consignmentId) {
      const consignmentIndex = consignments.findIndex((c) => c.id === consignmentId)
      if (consignmentIndex !== -1) {
        consignments[consignmentIndex] = {
          ...consignments[consignmentIndex],
          status: "pending",
          truckId: null,
        }
      }
    }

    return trucks[truckIndex]
  })
}

export async function login(email, password) {
  await delay(500)
  if (email === "admin@example.com" && password === "password") {
    return {
      success: true,
      user: {
        email,
        fullName: "Admin User",
        role: "ADMIN",
      },
      token: "mock-jwt-token",
    }
  }

  const registeredUsers = localStorage.getItem("registeredUsers")
  if (registeredUsers) {
    const users = JSON.parse(registeredUsers)
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        user: userWithoutPassword,
        token: "mock-jwt-token",
      }
    }
  }

  throw new Error("Invalid credentials")
}

export async function register(userData) {
  await delay(500)
  const registeredUsers = localStorage.getItem("registeredUsers")
  const users = registeredUsers ? JSON.parse(registeredUsers) : []

  if (users.some((user) => user.email === userData.email)) {
    throw new Error("Email is already registered")
  }

  const newUser = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    phone: userData.phone,
    address: userData.address,
  }

  users.push(newUser)
  localStorage.setItem("registeredUsers", JSON.stringify(users))

  const { password, confirmPassword, ...userWithoutPassword } = userData
  return {
    success: true,
    user: userWithoutPassword,
    token: "mock-jwt-token",
  }
}

export async function getCurrentUser() {
  await delay(500)
  const user = localStorage.getItem("user")
  if (user) {
    return JSON.parse(user)
  }
  throw new Error("Not authenticated")
}
