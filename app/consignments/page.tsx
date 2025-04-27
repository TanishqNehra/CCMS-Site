"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, TruckIcon, Clock } from "lucide-react"
import ConsignmentTable from "@/components/consignment-table"
import ConsignmentForm from "@/components/consignment-form"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import NewConsignmentModal from "@/components/new-consignment-modal"

export default function ConsignmentsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [consignmentType, setConsignmentType] = useState("all")
  const [trackingId, setTrackingId] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isNewConsignmentModalOpen, setIsNewConsignmentModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would filter the consignments based on the search query
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    })
  }

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingId) {
      toast({
        title: "Tracking ID required",
        description: "Please enter a tracking ID to track a consignment",
        variant: "destructive",
      })
      return
    }

    // Simulate API call to track consignment
    // In a real app, this would fetch the consignment data from the API
    setTimeout(() => {
      if (trackingId === "CCM1234567") {
        setTrackingResult({
          id: "CCM1234567",
          type: "Parcel",
          weight: "2kg",
          status: "In Transit",
          origin: "New York Branch",
          destination: "Chicago",
          updates: [
            {
              status: "Package Received",
              date: "Apr 10, 2023 - 09:30 AM",
              location: "New York Branch",
            },
            {
              status: "In Transit",
              date: "Apr 11, 2023 - 10:15 AM",
              location: "En route to Chicago",
            },
          ],
          estimatedDelivery: "Apr 13, 2023 - By end of day",
        })
      } else {
        toast({
          title: "Consignment not found",
          description: "No consignment found with the provided tracking ID",
          variant: "destructive",
        })
        setTrackingResult(null)
      }
    }, 500)
  }

  if (!isAuthenticated) {
    return null // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Consignment Management</h1>
        <Button onClick={() => setIsNewConsignmentModalOpen(true)}>New Consignment</Button>
      </div>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Consignments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by tracking ID, customer name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={consignmentType} onValueChange={setConsignmentType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="parcel">Parcel</SelectItem>
              <SelectItem value="package">Package</SelectItem>
              <SelectItem value="freight">Freight</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Search</Button>
        </form>
        <TabsContent value="all">
          <ConsignmentTable />
        </TabsContent>
        <TabsContent value="pending">
          <ConsignmentTable status="pending" />
        </TabsContent>
        <TabsContent value="in-transit">
          <ConsignmentTable status="in-transit" />
        </TabsContent>
        <TabsContent value="delivered">
          <ConsignmentTable status="delivered" />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Consignment</CardTitle>
            <CardDescription>Enter the details to create a new consignment</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsignmentForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Track Consignment</CardTitle>
            <CardDescription>Enter tracking ID to get real-time status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="flex space-x-2">
                <Input
                  placeholder="Enter tracking ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <Button type="submit">Track</Button>
              </form>

              {trackingResult && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Tracking ID: {trackingResult.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {trackingResult.type} - {trackingResult.weight}
                      </p>
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                      {trackingResult.status}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {trackingResult.updates.map((update: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                          {update.status === "Package Received" ? (
                            <Package className="h-4 w-4 text-green-600" />
                          ) : (
                            <TruckIcon className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{update.status}</p>
                          <p className="text-sm text-muted-foreground">{update.date}</p>
                          <p className="text-sm">{update.location}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">{trackingResult.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!trackingResult && trackingId && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Try with tracking ID: CCM1234567</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewConsignmentModal isOpen={isNewConsignmentModalOpen} onClose={() => setIsNewConsignmentModalOpen(false)} />
    </DashboardLayout>
  )
}
