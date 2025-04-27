"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export default function PerformanceMetrics() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading metrics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">On-Time Delivery Rate</div>
            <div className="text-sm font-medium">92%</div>
          </div>
          <Progress value={92} className="h-2" />
          <p className="text-xs text-muted-foreground">Target: 95%</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Truck Utilization</div>
            <div className="text-sm font-medium">78%</div>
          </div>
          <Progress value={78} className="h-2" />
          <p className="text-xs text-muted-foreground">Target: 85%</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">First Attempt Delivery Success</div>
            <div className="text-sm font-medium">87%</div>
          </div>
          <Progress value={87} className="h-2" />
          <p className="text-xs text-muted-foreground">Target: 90%</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Customer Satisfaction</div>
            <div className="text-sm font-medium">96%</div>
          </div>
          <Progress value={96} className="h-2" />
          <p className="text-xs text-muted-foreground">Target: 95%</p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Branch Performance Comparison</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-24 text-sm">New York</div>
            <div className="flex-1">
              <Progress value={94} className="h-2" />
            </div>
            <div className="w-12 text-right text-sm">94%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Chicago</div>
            <div className="flex-1">
              <Progress value={88} className="h-2" />
            </div>
            <div className="w-12 text-right text-sm">88%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Los Angeles</div>
            <div className="flex-1">
              <Progress value={91} className="h-2" />
            </div>
            <div className="w-12 text-right text-sm">91%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Miami</div>
            <div className="flex-1">
              <Progress value={86} className="h-2" />
            </div>
            <div className="w-12 text-right text-sm">86%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
