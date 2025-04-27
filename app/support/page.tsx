"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone, TicketIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import LiveChatSupport from "@/components/live-chat-support"
import TicketForm from "@/components/ticket-form"
import TicketList from "@/components/ticket-list"
import { useToast } from "@/hooks/use-toast"

export default function SupportPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

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
      title: "Searching knowledge base",
      description: `Searching for: ${searchQuery}`,
    })
  }

  if (!isAuthenticated) {
    return null // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <Button onClick={() => setActiveTab("tickets")}>Submit a Ticket</Button>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>Search our knowledge base for quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Live Chat
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <TicketIcon className="h-4 w-4 mr-2" />
            Support Tickets
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <LiveChatSupport />
        </TabsContent>

        <TabsContent value="tickets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>Fill out the form to create a new support ticket</CardDescription>
              </CardHeader>
              <CardContent>
                <TicketForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
                <CardDescription>View and manage your support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <TicketList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Support
                </CardTitle>
                <CardDescription>Talk to our support team directly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Customer Service:</p>
                  <p className="text-lg">1-800-123-4567</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>

                  <p className="font-medium mt-4">Technical Support:</p>
                  <p className="text-lg">1-800-765-4321</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 8am-8pm EST</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Support
                </CardTitle>
                <CardDescription>Send us an email for non-urgent issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">General Inquiries:</p>
                  <p className="text-lg">support@cccms.com</p>
                  <p className="text-sm text-muted-foreground">Response within 24 hours</p>

                  <p className="font-medium mt-4">Billing Questions:</p>
                  <p className="text-lg">billing@cccms.com</p>
                  <p className="text-sm text-muted-foreground">Response within 48 hours</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Live Chat
                </CardTitle>
                <CardDescription>Chat with our support team in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Our live chat support is available:</p>
                  <p className="font-medium">Monday - Friday</p>
                  <p>8:00 AM - 10:00 PM EST</p>

                  <p className="font-medium mt-4">Saturday - Sunday</p>
                  <p>9:00 AM - 6:00 PM EST</p>

                  <Button className="w-full mt-4" onClick={() => setActiveTab("chat")}>
                    Start Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium mb-1">How do I track my consignment?</h3>
                <p className="text-sm text-muted-foreground">
                  You can track your consignment by entering your tracking ID in the tracking section of our website or
                  mobile app. You can also receive updates via SMS or email.
                </p>
              </div>
              <div className="border-b pb-3">
                <h3 className="font-medium mb-1">What should I do if my delivery is delayed?</h3>
                <p className="text-sm text-muted-foreground">
                  If your delivery is delayed, you can check the status using your tracking ID. If there's a significant
                  delay, please contact our customer support team through any of our support channels.
                </p>
              </div>
              <div className="border-b pb-3">
                <h3 className="font-medium mb-1">How do I schedule a pickup?</h3>
                <p className="text-sm text-muted-foreground">
                  You can schedule a pickup through our website or mobile app. Simply log in to your account, select
                  "Schedule Pickup," and follow the instructions to set a date and time.
                </p>
              </div>
              <div className="border-b pb-3">
                <h3 className="font-medium mb-1">What are your delivery hours?</h3>
                <p className="text-sm text-muted-foreground">
                  Our standard delivery hours are from 9:00 AM to 7:00 PM, Monday through Saturday. Sunday deliveries
                  are available in select areas for an additional fee.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">How can I change the delivery address?</h3>
                <p className="text-sm text-muted-foreground">
                  To change the delivery address, please contact our customer support team as soon as possible. Address
                  changes may be subject to additional fees and can only be made before the package is out for delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
