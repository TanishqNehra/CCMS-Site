"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Info, AlertTriangle, Clock, MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DeliveryPredictionProps {
  period: string
  branch: string
}

export default function DeliveryPrediction({ period, branch }: DeliveryPredictionProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading delivery prediction data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Delivery Delay Prediction</h3>
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
                    AI analysis of weather patterns, traffic data, historical performance, and current operational
                    status to predict potential delivery delays.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">Proactive identification of potential delivery delays</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Updated hourly
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
            <div className="text-sm font-medium text-muted-foreground mb-1">Current Risk Level</div>
            <div className="text-2xl font-bold text-amber-600">Medium</div>
            <p className="text-xs text-muted-foreground mt-1">3 routes with potential delays</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Average Delay Prediction</div>
            <div className="text-2xl font-bold">42 minutes</div>
            <p className="text-xs text-muted-foreground mt-1">For affected routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Primary Delay Factor</div>
            <div className="text-2xl font-bold text-blue-600">Weather</div>
            <p className="text-xs text-muted-foreground mt-1">Heavy rain in northeastern routes</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[250px] w-full bg-[url('/delivery-route-delays.png')] bg-cover bg-center rounded-lg border">
        <div className="p-4 bg-white/80 rounded-md m-4 max-w-xs">
          <h4 className="text-sm font-medium">Delay Risk Map</h4>
          <p className="text-xs text-muted-foreground">Routes color-coded by delay risk level</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">High-Risk Deliveries</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Consignment ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Estimated Delay</TableHead>
              <TableHead>Risk Factors</TableHead>
              <TableHead>Recommended Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">CCM8765432</TableCell>
              <TableCell>Seattle, WA</TableCell>
              <TableCell className="text-amber-600">45-60 min</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">Heavy traffic, Weather</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Reroute
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">CCM1234567</TableCell>
              <TableCell>Chicago, IL</TableCell>
              <TableCell className="text-red-600">60-90 min</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Road closure, Construction</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Reschedule
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">CCM5432167</TableCell>
              <TableCell>Boston, MA</TableCell>
              <TableCell className="text-amber-600">30-45 min</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs">Weather, High volume</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Notify Customer
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
