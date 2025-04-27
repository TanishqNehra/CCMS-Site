"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Phone } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import BranchDetailsModal from "@/components/branch-details-modal"
import NewBranchModal from "@/components/new-branch-modal"

export default function BranchesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("list")
  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Sample branches data
  const branches = [
    {
      id: "BR-001",
      name: "New York Branch",
      address: "123 Main St, New York, NY 10001",
      phone: "212-555-1234",
      email: "newyork@cccms.com",
      manager: "John Smith",
      employees: 25,
      status: "active",
    },
    {
      id: "BR-002",
      name: "Chicago Branch",
      address: "456 Oak Ave, Chicago, IL 60601",
      phone: "312-555-5678",
      email: "chicago@cccms.com",
      manager: "Sarah Johnson",
      employees: 18,
      status: "active",
    },
    {
      id: "BR-003",
      name: "Los Angeles Branch",
      address: "789 Palm Blvd, Los Angeles, CA 90001",
      phone: "213-555-9012",
      email: "losangeles@cccms.com",
      manager: "Michael Brown",
      employees: 22,
      status: "active",
    },
    {
      id: "BR-004",
      name: "Miami Branch",
      address: "321 Beach Dr, Miami, FL 33101",
      phone: "305-555-3456",
      email: "miami@cccms.com",
      manager: "Emily Davis",
      employees: 15,
      status: "maintenance",
    },
    {
      id: "BR-005",
      name: "Boston Branch",
      address: "654 Harbor St, Boston, MA 02101",
      phone: "617-555-7890",
      email: "boston@cccms.com",
      manager: "David Wilson",
      employees: 12,
      status: "active",
    },
  ]

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
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    })
  }

  const handleViewBranch = (id: string) => {
    setSelectedBranchId(id)
    setIsDetailsModalOpen(true)
  }

  if (!isAuthenticated) {
    return null // Or a loading spinner
  }

  const filteredBranches = searchQuery
    ? branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : branches

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Branch Management</h1>
        <Button onClick={() => setIsNewBranchModalOpen(true)}>Add New Branch</Button>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">Branch List</TabsTrigger>
          <TabsTrigger value="map">Branch Map</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by branch name, ID, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Branch Locations</CardTitle>
              <CardDescription>Manage your company's branch offices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No branches found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBranches.map((branch) => (
                        <TableRow key={branch.id}>
                          <TableCell className="font-medium">{branch.id}</TableCell>
                          <TableCell>{branch.name}</TableCell>
                          <TableCell>{branch.address}</TableCell>
                          <TableCell>{branch.manager}</TableCell>
                          <TableCell>{branch.employees}</TableCell>
                          <TableCell>
                            {branch.status === "active" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                                Maintenance
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs">{branch.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewBranch(branch.id)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Branch Locations Map</CardTitle>
              <CardDescription>Geographic distribution of branch offices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full bg-slate-100 rounded-lg overflow-hidden">
                {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
                <div className="w-full h-full bg-[url('/world-map-vintage.png')] bg-cover bg-center relative">
                  {/* Branch markers */}
                  <div className="absolute top-[30%] left-[25%] bg-white p-1 rounded-full border-2 border-primary">
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                    <div className="absolute top-6 left-[-30px] bg-white px-2 py-1 rounded shadow-md text-xs">
                      New York Branch
                    </div>
                  </div>
                  <div className="absolute top-[45%] left-[40%] bg-white p-1 rounded-full border-2 border-primary">
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                    <div className="absolute top-6 left-[-30px] bg-white px-2 py-1 rounded shadow-md text-xs">
                      Chicago Branch
                    </div>
                  </div>
                  <div className="absolute top-[60%] left-[70%] bg-white p-1 rounded-full border-2 border-primary">
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                    <div className="absolute top-6 left-[-30px] bg-white px-2 py-1 rounded shadow-md text-xs">
                      Los Angeles Branch
                    </div>
                  </div>
                  <div className="absolute top-[70%] left-[60%] bg-white p-1 rounded-full border-2 border-amber-500">
                    <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    <div className="absolute top-6 left-[-30px] bg-white px-2 py-1 rounded shadow-md text-xs">
                      Miami Branch
                    </div>
                  </div>
                  <div className="absolute top-[35%] left-[60%] bg-white p-1 rounded-full border-2 border-primary">
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                    <div className="absolute top-6 left-[-30px] bg-white px-2 py-1 rounded shadow-md text-xs">
                      Boston Branch
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Branch Performance</CardTitle>
              <CardDescription>Key metrics and performance indicators for each branch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {branches.map((branch) => (
                  <div key={branch.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">{branch.name}</h3>
                        <p className="text-sm text-muted-foreground">Manager: {branch.manager}</p>
                      </div>
                      {branch.status === "active" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          Maintenance
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Monthly Shipments</p>
                        <p className="text-2xl font-bold">{Math.floor(Math.random() * 500) + 200}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                        <p className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 90}%</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                        <p className="text-2xl font-bold">{(Math.random() * 1 + 4).toFixed(1)}/5.0</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleViewBranch(branch.id)}>
                        View Full Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Across {3} states</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branches.reduce((sum, branch) => sum + branch.employees, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branches.filter((b) => b.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {((branches.filter((b) => b.status === "active").length / branches.length) * 100).toFixed(0)}% of total
              branches
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedBranchId && (
        <BranchDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          branchId={selectedBranchId}
          branches={branches}
        />
      )}

      <NewBranchModal isOpen={isNewBranchModalOpen} onClose={() => setIsNewBranchModalOpen(false)} />
    </DashboardLayout>
  )
}
