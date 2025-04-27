"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Ticket = {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  createdAt: Date
  lastUpdated: Date
}

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  senderName: string
  timestamp: Date
}

interface TicketDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket
}

export default function TicketDetailsModal({ isOpen, onClose, ticket }: TicketDetailsModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "I've been waiting for my package for over a week now, and the tracking hasn't updated in 3 days. Can you please check what's happening?",
      sender: "user",
      senderName: "You",
      timestamp: ticket.createdAt,
    },
    {
      id: "2",
      content:
        "Hello, thank you for reaching out. I'm sorry to hear about the delay with your delivery. I'll check the status of your package right away. Could you please confirm the tracking number or order ID?",
      sender: "agent",
      senderName: "Support Agent",
      timestamp: new Date(ticket.createdAt.getTime() + 2 * 60 * 60 * 1000), // 2 hours after creation
    },
    {
      id: "3",
      content: "The tracking number is CCM1234567. It was supposed to be delivered last Friday.",
      sender: "user",
      senderName: "You",
      timestamp: new Date(ticket.createdAt.getTime() + 3 * 60 * 60 * 1000), // 3 hours after creation
    },
    {
      id: "4",
      content:
        "Thank you for providing the tracking number. I've checked our system and I can see that there was a delay due to weather conditions affecting our delivery routes. The package is currently at our distribution center and is scheduled for delivery tomorrow. I've flagged this as a priority delivery. I apologize for the inconvenience caused.",
      sender: "agent",
      senderName: "Support Agent",
      timestamp: new Date(ticket.createdAt.getTime() + 5 * 60 * 60 * 1000), // 5 hours after creation
    },
  ])
  const [newReply, setNewReply] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newReply.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, this would send the reply to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newReply,
        sender: "user",
        senderName: "You",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setNewReply("")

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to our support team",
      })

      // Simulate agent response after delay (in a real app, this would come from your backend)
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Thank you for your response. We're continuing to monitor your delivery and will update you as soon as there's any change in status.",
          sender: "agent",
          senderName: "Support Agent",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, agentMessage])
      }, 5000)
    } catch (error) {
      toast({
        title: "Error sending reply",
        description: "There was an error sending your reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription>Ticket ID: {ticket.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{ticket.subject}</h3>
              <p className="text-sm text-muted-foreground">
                Created on {ticket.createdAt.toLocaleDateString()} at{" "}
                {ticket.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
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

          <div className="flex flex-wrap gap-2">
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

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Conversation</h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {message.sender === "agent" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                        <AvatarFallback>SA</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{message.senderName}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleDateString()} at{" "}
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 mt-1 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/vibrant-street-market.png" alt="You" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <form onSubmit={handleSubmitReply} className="border-t pt-4">
              <h4 className="font-medium mb-2">Reply</h4>
              <Textarea
                placeholder="Type your reply here..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={3}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newReply.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {ticket.status === "resolved" && <Button variant="destructive">Reopen Ticket</Button>}
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <Button variant="default">Mark as Resolved</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
