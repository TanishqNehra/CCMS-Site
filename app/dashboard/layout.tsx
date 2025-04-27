import type React from "react"
import { AppProvider } from "@/context/app-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppProvider>{children}</AppProvider>
}
