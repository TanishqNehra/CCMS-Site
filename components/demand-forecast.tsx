"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Info, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DemandForecastProps {
  period: string
  branch: string
}

export default function DemandForecast({ period, branch }: DemandForecastProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading forecast data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Demand Forecast Analysis</h3>
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
                    This forecast is generated using machine learning algorithms trained on historical data, seasonal
                    patterns, and market trends.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Predicted demand trends for the next{" "}
            {period === "week"
              ? "7 days"
              : period === "month"
                ? "30 days"
                : period === "quarter"
                  ? "90 days"
                  : "365 days"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Confidence: 92%
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Expected Volume Change</div>
            <div className="text-2xl font-bold text-green-600">+18.3%</div>
            <p className="text-xs text-muted-foreground mt-1">Compared to previous {period}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Peak Day Prediction</div>
            <div className="text-2xl font-bold">Thursday</div>
            <p className="text-xs text-muted-foreground mt-1">+32% above average volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Seasonal Impact</div>
            <div className="text-2xl font-bold text-amber-600">Medium</div>
            <p className="text-xs text-muted-foreground mt-1">Holiday season approaching</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[300px] w-full bg-[url('/demand-forecast-confidence.png')] bg-cover bg-center rounded-lg border">
        <div className="p-4">
          <h4 className="text-sm font-medium">Demand Forecast Trend</h4>
          <p className="text-xs text-muted-foreground">With 95% confidence intervals</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">AI Insights</h4>
        <div className="bg-muted p-4 rounded-lg text-sm">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-800 p-1 rounded-full mt-0.5">
                <TrendingUp className="h-3 w-3" />
              </span>
              <span>
                <strong>Demand Spike:</strong> Expect a 27% increase in parcel volume on November 28-30 due to Black
                Friday sales.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mt-0.5">
                <Info className="h-3 w-3" />
              </span>
              <span>
                <strong>Regional Trend:</strong> The {branch === "all" ? "Chicago branch" : branch + " branch"} is
                projected to see the highest growth rate at 23%.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-amber-100 text-amber-800 p-1 rounded-full mt-0.5">
                <Info className="h-3 w-3" />
              </span>
              <span>
                <strong>Service Type:</strong> Express delivery services are forecasted to grow 31% faster than standard
                delivery.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
