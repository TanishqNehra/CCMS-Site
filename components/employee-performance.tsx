"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Sample performance data
const performanceData = [
  {
    id: "EMP001",
    name: "John Doe",
    position: "Driver",
    metrics: {
      deliveryTime: 95,
      customerSatisfaction: 92,
      vehicleMaintenance: 88,
      overallScore: 92,
    },
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    position: "Logistics Manager",
    metrics: {
      teamManagement: 90,
      resourceOptimization: 94,
      processImprovement: 85,
      overallScore: 88,
    },
  },
  {
    id: "EMP003",
    name: "Robert Johnson",
    position: "Warehouse Operator",
    metrics: {
      inventoryAccuracy: 82,
      loadingSpeed: 78,
      safetyCompliance: 95,
      overallScore: 75,
    },
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    position: "Customer Service",
    metrics: {
      responseTime: 96,
      issueResolution: 94,
      customerFeedback: 98,
      overallScore: 95,
    },
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    position: "Driver",
    metrics: {
      deliveryTime: 85,
      customerSatisfaction: 88,
      vehicleMaintenance: 79,
      overallScore: 82,
    },
  },
]

export default function EmployeePerformance() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="individual">
        <TabsList className="mb-4">
          <TabsTrigger value="individual">Individual Performance</TabsTrigger>
          <TabsTrigger value="department">Department Comparison</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Individual Performance Metrics</h2>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Performance Score</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.id}</div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={employee.metrics.overallScore} className="w-[60%]" />
                          <span className="text-sm font-medium">{employee.metrics.overallScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="grid grid-cols-1 gap-1">
                          {Object.entries(employee.metrics)
                            .filter(([key]) => key !== "overallScore")
                            .map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="text-xs font-medium">{value}%</span>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="department">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drivers Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Delivery Time</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Vehicle Maintenance</span>
                      <span className="text-sm text-muted-foreground">83%</span>
                    </div>
                    <Progress value={83} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logistics Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Team Management</span>
                      <span className="text-sm text-muted-foreground">88%</span>
                    </div>
                    <Progress value={88} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Resource Optimization</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Process Improvement</span>
                      <span className="text-sm text-muted-foreground">79%</span>
                    </div>
                    <Progress value={79} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Performance trend chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
