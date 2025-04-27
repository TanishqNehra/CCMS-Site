"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function LiveChatSupport() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate connecting to chat service
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      setAgentName("Sarah Johnson")

      // Add initial agent message
      setMessages([
        {
          id: "1",
          content: "Hello! I'm Sarah from customer support. How can I help you today?",
          sender: "agent",
          timestamp: new Date(),
        },
      ])
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate agent typing
    setIsTyping(true)

    // Simulate agent response after delay
    setTimeout(() => {
      setIsTyping(false)

      // Generate a simple response based on the user's message
      let responseContent = "I understand. Let me check that for you."

      if (newMessage.toLowerCase().includes("delivery")) {
        responseContent =
          "Our standard delivery times are 1-3 business days. If you're experiencing a delay, I can look into that for you. Could you provide your tracking number?"
      } else if (newMessage.toLowerCase().includes("track")) {
        responseContent = "I'd be happy to help you track your package. Could you please provide your tracking number?"
      } else if (newMessage.toLowerCase().includes("price") || newMessage.toLowerCase().includes("cost")) {
        responseContent =
          "Our pricing depends on the package size, weight, and destination. I can provide a quote if you share those details."
      } else if (newMessage.toLowerCase().includes("thank")) {
        responseContent = "You're welcome! Is there anything else I can help you with today?"
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
    }, 2000)
  }

  const handleEndChat = () => {
    toast({
      title: "Chat ended",
      description: "Your chat transcript has been emailed to you for reference.",
    })

    // Reset chat state
    setMessages([])
    setIsConnected(false)
    setIsConnecting(true)

    // Simulate reconnecting
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      setAgentName("Michael Smith")

      setMessages([
        {
          id: "1",
          content: "Hello! I'm Michael from customer support. How can I help you today?",
          sender: "agent",
          timestamp: new Date(),
        },
      ])
    }, 2000)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            Live Support
            {isConnected && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
            )}
          </div>
          {isConnected && (
            <Button variant="outline" size="sm" onClick={handleEndChat}>
              End Chat
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto mb-4">
        {isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Connecting to an agent...</p>
            <p className="text-sm text-muted-foreground mt-2">This usually takes less than 30 seconds</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender === "agent" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/friendly-support.png" alt={agentName} />
                      <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {message.sender === "agent" && <p className="text-xs text-muted-foreground mb-1">{agentName}</p>}
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
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

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/friendly-support.png" alt={agentName} />
                    <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{agentName}</p>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "400ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected || isConnecting}
          />
          <Button type="submit" size="icon" disabled={!isConnected || isConnecting || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
