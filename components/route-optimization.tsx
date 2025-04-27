"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Info, TrendingDown, Fuel, Clock, MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface RouteOptimizationProps {
  period: string
  branch: string
}

export default function RouteOptimization({ period, branch }: RouteOptimizationProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading route optimization data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Historical Route Optimization</h3>
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
                    AI analysis of historical delivery data to identify optimal routes, considering traffic patterns,
                    delivery times, and fuel efficiency.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">Route optimization based on historical performance data</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Last optimized: 2 days ago
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Routes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Potential Time Savings</div>
            <div className="text-2xl font-bold text-green-600">14.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Average across all routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Fuel Efficiency Improvement</div>
            <div className="text-2xl font-bold text-green-600">8.7%</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated monthly savings: $3,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Routes Optimized</div>
            <div className="text-2xl font-bold">18/24</div>
            <p className="text-xs text-muted-foreground mt-1">6 routes pending optimization</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[300px] w-full bg-[url('/optimized-delivery-routes.png')] bg-cover bg-center rounded-lg border">
        <div className="p-4 bg-white/80 rounded-md m-4 max-w-xs">
          <h4 className="text-sm font-medium">Route Optimization Map</h4>
          <p className="text-xs text-muted-foreground">Before/after comparison of optimized routes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Top Optimization Opportunities</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  Chicago Downtown Route
                </div>
                <div className="text-sm font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  23% potential improvement
                </div>
              </div>
              <Progress value={23} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 2.4 hrs avg</span>
                <span>Optimized: 1.85 hrs avg</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  Boston North Route
                </div>
                <div className="text-sm font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  19% potential improvement
                </div>
              </div>
              <Progress value={19} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 3.1 hrs avg</span>
                <span>Optimized: 2.5 hrs avg</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  Miami Beach Route
                </div>
                <div className="text-sm font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  17% potential improvement
                </div>
              </div>
              <Progress value={17} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: 1.8 hrs avg</span>
                <span>Optimized: 1.5 hrs avg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Optimization Insights</h4>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 p-1.5 rounded-full mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Time-Based Routing</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Historical data shows 32% faster delivery times when downtown routes are scheduled between 10am-2pm
                    instead of 8am-10am.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 p-1.5 rounded-full mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Stop Sequence Optimization</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reordering delivery stops on Route #12 can reduce total distance by 14.3 miles (18%) per day.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 text-amber-800 p-1.5 rounded-full mt-0.5">
                  <Fuel className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Fuel Efficiency</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alternative routes for 6 delivery zones can reduce fuel consumption by 12.5% while maintaining
                    delivery times.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Apply Optimized Routes</Button>
        </div>
      </div>
    </div>
  )
}
