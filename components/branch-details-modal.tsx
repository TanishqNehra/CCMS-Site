"use client"

import { Card } from "@/components/ui/card"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, MapPin, Phone, Mail, User, Package, Truck, Calendar } from "lucide-react"
import { FileText, Printer } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type Branch = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  employees: number
  status: string
}

interface BranchDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  branchId: string
  branches: Branch[]
}

export default function BranchDetailsModal({ isOpen, onClose, branchId, branches }: BranchDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")

  const branch = branches.find((b) => b.id === branchId)

  if (!branch) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{branch.name}</DialogTitle>
          <DialogDescription>Branch ID: {branch.id}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Branch Details</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{branch.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {branch.address}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    ${branch.status === "active" ? "bg-green-50 text-green-700" : ""}
                    ${branch.status === "maintenance" ? "bg-amber-50 text-amber-700" : ""}
                  `}
                >
                  {branch.status === "active" ? "Active" : "Maintenance"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{branch.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Branch Manager:</span> {branch.manager}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Total Employees:</span> {branch.employees}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Branch Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Branch Activity</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Consignment Received</p>
                      <p className="text-sm text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full">
                      <Truck className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Truck Dispatched</p>
                      <p className="text-sm text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Monthly Performance Review</p>
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Staff Directory</h3>
                <Badge>{branch.employees} Employees</Badge>
              </div>

              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{branch.manager}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Branch Manager</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">manager@cccms.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">Jennifer Adams</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Operations Supervisor</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">operations@cccms.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">Robert Chen</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Logistics Coordinator</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">logistics@cccms.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">Maria Rodriguez</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Customer Service Lead</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">customerservice@cccms.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">James Wilson</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Warehouse Supervisor</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">warehouse@cccms.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          On Leave
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Operational Metrics</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Last 30 Days
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Shipment Volume</h4>
                  <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Shipment volume chart would appear here</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Shipments</p>
                      <p className="font-medium">{Math.floor(Math.random() * 500) + 200}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <p className="font-medium text-green-600">+{Math.floor(Math.random() * 15) + 5}%</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Delivery Performance</h4>
                  <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Delivery performance chart would appear here</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                      <p className="font-medium">{Math.floor(Math.random() * 10) + 90}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Issues</p>
                      <p className="font-medium text-red-600">{Math.floor(Math.random() * 5) + 1}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Resource Utilization</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Truck Utilization</p>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 20) + 75}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{Math.floor(Math.random() * 20) + 75}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Warehouse Capacity</p>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 30) + 60}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{Math.floor(Math.random() * 30) + 60}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Staff Efficiency</p>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 15) + 80}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{Math.floor(Math.random() * 15) + 80}%</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payroll">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Payroll Management</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => window.open("/payroll-report.pdf", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Payroll Report
                  </Button>
                  <Button size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Pay Slips
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Current Pay Period</div>
                  <div className="text-lg font-bold">May 1 - May 15, 2023</div>
                  <div className="text-xs text-muted-foreground mt-1">Processing on May 20, 2023</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total Payroll Amount</div>
                  <div className="text-lg font-bold">$47,250.00</div>
                  <div className="text-xs text-muted-foreground mt-1">For 25 employees</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Overtime Hours</div>
                  <div className="text-lg font-bold">142 hours</div>
                  <div className="text-xs text-muted-foreground mt-1">$4,260.00 in overtime pay</div>
                </Card>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Regular Hours</TableHead>
                      <TableHead>Overtime Hours</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{branch.manager}</TableCell>
                      <TableCell>Branch Manager</TableCell>
                      <TableCell>80</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>$500.00</TableCell>
                      <TableCell>$4,500.00</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Pay slip generated",
                              description: "Pay slip for Branch Manager has been generated",
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Pay Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Jennifer Adams</TableCell>
                      <TableCell>Operations Supervisor</TableCell>
                      <TableCell>80</TableCell>
                      <TableCell>6</TableCell>
                      <TableCell>$200.00</TableCell>
                      <TableCell>$3,290.00</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Pay slip generated",
                              description: "Pay slip for Operations Supervisor has been generated",
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Pay Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Robert Chen</TableCell>
                      <TableCell>Logistics Coordinator</TableCell>
                      <TableCell>80</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>$150.00</TableCell>
                      <TableCell>$3,030.00</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Pay slip generated",
                              description: "Pay slip for Logistics Coordinator has been generated",
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Pay Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Maria Rodriguez</TableCell>
                      <TableCell>Customer Service Lead</TableCell>
                      <TableCell>80</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>$100.00</TableCell>
                      <TableCell>$2,560.00</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Pay slip generated",
                              description: "Pay slip for Customer Service Lead has been generated",
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Pay Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">James Wilson</TableCell>
                      <TableCell>Warehouse Supervisor</TableCell>
                      <TableCell>64</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>$1,920.00</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Pay slip generated",
                              description: "Pay slip for Warehouse Supervisor has been generated",
                            })
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Pay Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Payroll Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Pay Rate (Manager)</span>
                      <span className="text-sm font-medium">$50.00/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Pay Rate (Supervisor)</span>
                      <span className="text-sm font-medium">$35.00/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Pay Rate (Staff)</span>
                      <span className="text-sm font-medium">$25.00/hr</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Overtime Rate</span>
                      <span className="text-sm font-medium">1.5x Regular Rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Performance Bonus Threshold</span>
                      <span className="text-sm font-medium">95% On-Time Delivery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pay Period</span>
                      <span className="text-sm font-medium">Bi-weekly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" asChild>
                <a href="/branches/payroll" target="_blank" rel="noreferrer">
                  Open Full Payroll System
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Edit Branch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
