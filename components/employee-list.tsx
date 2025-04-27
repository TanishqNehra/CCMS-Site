"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Mail, Phone } from "lucide-react"
import EmployeeDetailsModal from "./employee-details-modal"

// Sample employee data
const employees = [
  {
    id: "EMP001",
    name: "John Doe",
    position: "Driver",
    branch: "New York",
    status: "Active",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2022-03-15",
    performance: 92,
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    position: "Logistics Manager",
    branch: "Chicago",
    status: "Active",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    joinDate: "2021-08-10",
    performance: 88,
  },
  {
    id: "EMP003",
    name: "Robert Johnson",
    position: "Warehouse Operator",
    branch: "Los Angeles",
    status: "On Leave",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2022-01-05",
    performance: 75,
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    position: "Customer Service",
    branch: "Miami",
    status: "Active",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2021-11-20",
    performance: 95,
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    position: "Driver",
    branch: "Boston",
    status: "Active",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 876-5432",
    joinDate: "2022-02-28",
    performance: 82,
  },
]

interface EmployeeListProps {
  searchQuery: string
}

export default function EmployeeList({ searchQuery }: EmployeeListProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[0] | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.id.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.branch.toLowerCase().includes(query)
    )
  })

  const handleViewDetails = (employee: (typeof employees)[0]) => {
    setSelectedEmployee(employee)
    setIsDetailsModalOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No employees found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === "Active" ? "default" : "secondary"}
                      className={employee.status === "Active" ? "bg-green-500" : ""}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title={`Email: ${employee.email}`}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title={`Phone: ${employee.phone}`}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(employee)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  )
}
