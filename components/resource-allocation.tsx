"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface ResourceAllocationProps {
  period: string
  branch: string
}

export default function ResourceAllocation({ period, branch }: ResourceAllocationProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading resource allocation data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Peak Season Resource Planning</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    AI-optimized resource allocation based on predicted demand patterns, historical performance, and
                    current capacity.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">Optimal resource distribution for the upcoming peak season</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Last updated: Today
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Resource Utilization Forecast</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Delivery Trucks</div>
                <div className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                  92% Projected
                </div>
              </div>
              <Progress value={92} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 68%</span>
                <span>Optimal: 85%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Warehouse Staff</div>
                <div className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  98% Projected
                </div>
              </div>
              <Progress value={98} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 72%</span>
                <span>Optimal: 85%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Sorting Capacity</div>
                <div className="text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  78% Projected
                </div>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 65%</span>
                <span>Optimal: 80%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Customer Service</div>
                <div className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  96% Projected
                </div>
              </div>
              <Progress value={96} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 70%</span>
                <span>Optimal: 85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">AI Recommendations</h4>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-800 p-1.5 rounded-full mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Critical: Staffing Shortage</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Warehouse staff projected to be 13% below required levels during peak week (Dec 15-22).
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    View Staffing Plan
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 text-amber-800 p-1.5 rounded-full mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Fleet Expansion Needed</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommend leasing 7 additional delivery vehicles from Nov 15 to Jan 15 to meet projected demand.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    View Fleet Plan
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 p-1.5 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Optimal Shift Distribution</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Shifting 30% of sorting capacity to evening shifts would optimize throughput during peak season.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    View Shift Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="h-[250px] w-full bg-[url('/resource-allocation-heatmap.png')] bg-cover bg-center rounded-lg border">
        <div className="p-4">
          <h4 className="text-sm font-medium">Resource Allocation Heatmap</h4>
          <p className="text-xs text-muted-foreground">Projected resource needs by department and time period</p>
        </div>
      </div>
    </div>
  )
}
