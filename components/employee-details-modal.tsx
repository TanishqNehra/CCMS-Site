"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Phone, MapPin, Calendar, Award, Clock, FileText } from "lucide-react"

interface EmployeeDetailsModalProps {
  employee: {
    id: string
    name: string
    position: string
    branch: string
    status: string
    email: string
    phone: string
    joinDate: string
    performance: number
  }
  isOpen: boolean
  onClose: () => void
}

export default function EmployeeDetailsModal({ employee, isOpen, onClose }: EmployeeDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                {employee.name.charAt(0)}
              </div>
              <CardTitle className="mt-4">{employee.name}</CardTitle>
              <CardDescription>{employee.position}</CardDescription>
              <Badge
                variant={employee.status === "Active" ? "default" : "secondary"}
                className={employee.status === "Active" ? "bg-green-500 mt-2" : "mt-2"}
              >
                {employee.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.branch} Branch</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="performance">
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Employee performance metrics and evaluations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Overall Performance</span>
                          <span>{employee.performance}%</span>
                        </div>
                        <Progress value={employee.performance} />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Key Strengths</span>
                          </div>
                          <ul className="list-disc list-inside text-sm space-y-1 pl-6">
                            <li>Excellent customer service</li>
                            <li>Consistently meets deadlines</li>
                            <li>Strong problem-solving skills</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Areas for Improvement</span>
                          </div>
                          <ul className="list-disc list-inside text-sm space-y-1 pl-6">
                            <li>Documentation thoroughness</li>
                            <li>Team collaboration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Schedule</CardTitle>
                    <CardDescription>Current and upcoming shifts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Shift</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Location</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>May 15, 2023</TableCell>
                              <TableCell>Morning</TableCell>
                              <TableCell>6:00 AM - 2:00 PM</TableCell>
                              <TableCell>{employee.branch}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>May 16, 2023</TableCell>
                              <TableCell>Night</TableCell>
                              <TableCell>10:00 PM - 6:00 AM</TableCell>
                              <TableCell>{employee.branch}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>May 18, 2023</TableCell>
                              <TableCell>Afternoon</TableCell>
                              <TableCell>2:00 PM - 10:00 PM</TableCell>
                              <TableCell>{employee.branch}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Documents</CardTitle>
                    <CardDescription>Important documents and records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Employee documents and records are available to authorized personnel only.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 border rounded-md">
                          <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-md bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Employment Contract</p>
                            <p className="text-xs text-muted-foreground">
                              Signed on {new Date(employee.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-md bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Performance Reviews</p>
                            <p className="text-xs text-muted-foreground">Last updated: April 15, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-md bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Training Certificates</p>
                            <p className="text-xs text-muted-foreground">3 certificates</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-md bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">ID Documents</p>
                            <p className="text-xs text-muted-foreground">Verified</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
