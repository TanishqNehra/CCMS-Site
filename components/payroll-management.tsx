"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, DollarSign, FileText, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PaySlipModal from "./pay-slip-modal"

type Employee = {
  id: string
  name: string
  position: string
  hourlyRate: number
  regularHours: number
  overtimeHours: number
  bonus: number
}

export default function PayrollManagement() {
  const { toast } = useToast()
  const [payPeriod, setPayPeriod] = useState("current")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isPaySlipModalOpen, setIsPaySlipModalOpen] = useState(false)

  // Sample employee data
  const employees: Employee[] = [
    {
      id: "EMP001",
      name: "John Smith",
      position: "Branch Manager",
      hourlyRate: 50,
      regularHours: 80,
      overtimeHours: 0,
      bonus: 500,
    },
    {
      id: "EMP002",
      name: "Jennifer Adams",
      position: "Operations Supervisor",
      hourlyRate: 35,
      regularHours: 80,
      overtimeHours: 6,
      bonus: 200,
    },
    {
      id: "EMP003",
      name: "Robert Chen",
      position: "Logistics Coordinator",
      hourlyRate: 30,
      regularHours: 80,
      overtimeHours: 12,
      bonus: 150,
    },
    {
      id: "EMP004",
      name: "Maria Rodriguez",
      position: "Customer Service Lead",
      hourlyRate: 28,
      regularHours: 80,
      overtimeHours: 4,
      bonus: 100,
    },
    {
      id: "EMP005",
      name: "James Wilson",
      position: "Warehouse Supervisor",
      hourlyRate: 30,
      regularHours: 64,
      overtimeHours: 0,
      bonus: 0,
    },
    {
      id: "EMP006",
      name: "Sarah Johnson",
      position: "Delivery Driver",
      hourlyRate: 25,
      regularHours: 80,
      overtimeHours: 8,
      bonus: 75,
    },
    {
      id: "EMP007",
      name: "Michael Brown",
      position: "Delivery Driver",
      hourlyRate: 25,
      regularHours: 80,
      overtimeHours: 10,
      bonus: 75,
    },
  ]

  // Calculate gross pay for an employee
  const calculateGrossPay = (employee: Employee) => {
    const regularPay = employee.regularHours * employee.hourlyRate
    const overtimePay = employee.overtimeHours * (employee.hourlyRate * 1.5)
    return regularPay + overtimePay + employee.bonus
  }

  // Calculate total payroll amount
  const totalPayroll = employees.reduce((sum, employee) => sum + calculateGrossPay(employee), 0)

  // Calculate total overtime hours
  const totalOvertimeHours = employees.reduce((sum, employee) => sum + employee.overtimeHours, 0)

  // Calculate total overtime pay
  const totalOvertimePay = employees.reduce(
    (sum, employee) => sum + employee.overtimeHours * (employee.hourlyRate * 1.5),
    0,
  )

  const handleGeneratePaySlip = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsPaySlipModalOpen(true)
  }

  const handlePrintAllPaySlips = () => {
    toast({
      title: "Printing all pay slips",
      description: "All pay slips for the current pay period are being sent to the printer.",
    })
  }

  const handleGeneratePayrollReport = () => {
    toast({
      title: "Generating payroll report",
      description: "Payroll report for the current pay period is being generated.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGeneratePayrollReport}>
            <FileText className="h-4 w-4 mr-2" />
            Payroll Report
          </Button>
          <Button onClick={handlePrintAllPaySlips}>
            <Printer className="h-4 w-4 mr-2" />
            Print All Pay Slips
          </Button>
        </div>
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="settings">Payroll Settings</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Pay Period</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">May 1 - May 15, 2023</div>
                <p className="text-xs text-muted-foreground">Processing on May 20, 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">${totalPayroll.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">For {employees.length} employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{totalOvertimeHours} hours</div>
                <p className="text-xs text-muted-foreground">${totalOvertimePay.toFixed(2)} in overtime pay</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="payPeriod">Pay Period:</Label>
              <Select value={payPeriod} onValueChange={setPayPeriod}>
                <SelectTrigger id="payPeriod" className="w-[200px]">
                  <SelectValue placeholder="Select pay period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">May 1 - May 15, 2023</SelectItem>
                  <SelectItem value="previous">Apr 16 - Apr 30, 2023</SelectItem>
                  <SelectItem value="previous2">Apr 1 - Apr 15, 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search employees..." className="w-[250px]" />
              <Button variant="outline">Search</Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Regular Hours</TableHead>
                  <TableHead>Overtime Hours</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.regularHours}</TableCell>
                    <TableCell>{employee.overtimeHours}</TableCell>
                    <TableCell>${employee.bonus.toFixed(2)}</TableCell>
                    <TableCell>${calculateGrossPay(employee).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleGeneratePaySlip(employee)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Pay Slip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Pay Rates</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="managerRate">Manager Rate ($/hr)</Label>
                        <Input id="managerRate" type="number" defaultValue="50.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supervisorRate">Supervisor Rate ($/hr)</Label>
                        <Input id="supervisorRate" type="number" defaultValue="35.00" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coordinatorRate">Coordinator Rate ($/hr)</Label>
                        <Input id="coordinatorRate" type="number" defaultValue="30.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffRate">Staff Rate ($/hr)</Label>
                        <Input id="staffRate" type="number" defaultValue="25.00" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Overtime & Bonus Settings</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="overtimeRate">Overtime Multiplier</Label>
                        <Input id="overtimeRate" type="number" defaultValue="1.5" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bonusThreshold">Performance Bonus Threshold (%)</Label>
                        <Input id="bonusThreshold" type="number" defaultValue="95" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="managerBonus">Manager Bonus ($)</Label>
                        <Input id="managerBonus" type="number" defaultValue="500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffBonus">Staff Bonus ($)</Label>
                        <Input id="staffBonus" type="number" defaultValue="100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Pay Period Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payFrequency">Pay Frequency</Label>
                    <Select defaultValue="biweekly">
                      <SelectTrigger id="payFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payDay">Pay Day</Label>
                    <Select defaultValue="friday">
                      <SelectTrigger id="payDay">
                        <SelectValue placeholder="Select pay day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Default Payment Method</Label>
                    <Select defaultValue="directDeposit">
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="directDeposit">Direct Deposit</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  onClick={() =>
                    toast({ title: "Settings saved", description: "Payroll settings have been updated successfully." })
                  }
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Employees Paid</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Apr 16 - Apr 30, 2023</TableCell>
                      <TableCell>May 5, 2023</TableCell>
                      <TableCell>25</TableCell>
                      <TableCell>$46,750.00</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 1 - Apr 15, 2023</TableCell>
                      <TableCell>Apr 20, 2023</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>$45,200.00</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mar 16 - Mar 31, 2023</TableCell>
                      <TableCell>Apr 5, 2023</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>$44,800.00</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mar 1 - Mar 15, 2023</TableCell>
                      <TableCell>Mar 20, 2023</TableCell>
                      <TableCell>23</TableCell>
                      <TableCell>$43,500.00</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEmployee && (
        <PaySlipModal
          isOpen={isPaySlipModalOpen}
          onClose={() => setIsPaySlipModalOpen(false)}
          employee={selectedEmployee}
          payPeriod="May 1 - May 15, 2023"
          payDate="May 20, 2023"
        />
      )}
    </div>
  )
}
