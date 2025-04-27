"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import TicketDetailsModal from "./ticket-details-modal"

type Ticket = {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  createdAt: Date
  lastUpdated: Date
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call to fetch tickets
    const fetchTickets = async () => {
      try {
        // In a real app, this would fetch tickets from your backend
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockTickets: Ticket[] = [
          {
            id: "TKT-1001",
            subject: "Delayed Delivery",
            category: "delivery",
            priority: "high",
            status: "open",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
          {
            id: "TKT-1002",
            subject: "Billing Discrepancy",
            category: "billing",
            priority: "medium",
            status: "in-progress",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            id: "TKT-1003",
            subject: "Account Access Issue",
            category: "technical",
            priority: "low",
            status: "resolved",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            lastUpdated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          },
        ]

        setTickets(mockTickets)
      } catch (error) {
        toast({
          title: "Error fetching tickets",
          description: "There was an error loading your tickets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [toast])

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading tickets...</p>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground mb-2">You don't have any support tickets yet.</p>
        <p className="text-sm text-muted-foreground">When you create a ticket, it will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{ticket.subject}</h3>
              <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
            </div>
            <Badge
              variant="outline"
              className={`
                ${ticket.status === "open" ? "bg-blue-50 text-blue-700" : ""}
                ${ticket.status === "in-progress" ? "bg-amber-50 text-amber-700" : ""}
                ${ticket.status === "resolved" ? "bg-green-50 text-green-700" : ""}
                ${ticket.status === "closed" ? "bg-gray-50 text-gray-700" : ""}
              `}
            >
              {ticket.status === "open" && "Open"}
              {ticket.status === "in-progress" && "In Progress"}
              {ticket.status === "resolved" && "Resolved"}
              {ticket.status === "closed" && "Closed"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">
              {ticket.category === "delivery" && "Delivery Issue"}
              {ticket.category === "billing" && "Billing Question"}
              {ticket.category === "technical" && "Technical Support"}
              {ticket.category === "account" && "Account Management"}
              {ticket.category === "feedback" && "Feedback"}
              {ticket.category === "other" && "Other"}
            </Badge>
            <Badge
              variant="outline"
              className={`
                ${ticket.priority === "low" ? "bg-green-50 text-green-700" : ""}
                ${ticket.priority === "medium" ? "bg-blue-50 text-blue-700" : ""}
                ${ticket.priority === "high" ? "bg-amber-50 text-amber-700" : ""}
                ${ticket.priority === "urgent" ? "bg-red-50 text-red-700" : ""}
              `}
            >
              {ticket.priority === "low" && "Low"}
              {ticket.priority === "medium" && "Medium"}
              {ticket.priority === "high" && "High"}
              {ticket.priority === "urgent" && "Urgent"}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
            <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      ))}

      {selectedTicket && (
        <TicketDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          ticket={selectedTicket}
        />
      )}
    </div>
  )
}
