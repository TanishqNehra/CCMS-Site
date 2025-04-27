"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Edit } from "lucide-react"

// Sample schedule data
const scheduleData = {
  "2023-05-15": [
    { id: "EMP001", name: "John Doe", shift: "Morning (6AM-2PM)", branch: "New York" },
    { id: "EMP004", name: "Emily Davis", shift: "Afternoon (2PM-10PM)", branch: "Miami" },
    { id: "EMP005", name: "Michael Wilson", shift: "Night (10PM-6AM)", branch: "Boston" },
  ],
  "2023-05-16": [
    { id: "EMP002", name: "Jane Smith", shift: "Morning (6AM-2PM)", branch: "Chicago" },
    { id: "EMP003", name: "Robert Johnson", shift: "Afternoon (2PM-10PM)", branch: "Los Angeles" },
    { id: "EMP001", name: "John Doe", shift: "Night (10PM-6AM)", branch: "New York" },
  ],
  "2023-05-17": [
    { id: "EMP005", name: "Michael Wilson", shift: "Morning (6AM-2PM)", branch: "Boston" },
    { id: "EMP002", name: "Jane Smith", shift: "Afternoon (2PM-10PM)", branch: "Chicago" },
    { id: "EMP004", name: "Emily Davis", shift: "Night (10PM-6AM)", branch: "Miami" },
  ],
}

export default function EmployeeSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"calendar" | "list">("calendar")

  // Get formatted date string for lookup
  const formattedDate = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : ""

  // Get schedule for selected date
  const scheduleForDate = scheduleData[formattedDate as keyof typeof scheduleData] || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work Schedules</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={{ before: new Date(2023, 0, 1) }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              Schedule for{" "}
              {date?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </h3>

            {scheduleForDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No schedules found for this date.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleForDate.map((schedule) => (
                    <TableRow key={`${schedule.id}-${schedule.shift}`}>
                      <TableCell className="font-medium">{schedule.id}</TableCell>
                      <TableCell>{schedule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{schedule.shift}</Badge>
                      </TableCell>
                      <TableCell>{schedule.branch}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
