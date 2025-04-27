"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Truck, Clock, Map } from "lucide-react"
import DemandForecast from "@/components/demand-forecast"
import ResourceAllocation from "@/components/resource-allocation"
import DeliveryPrediction from "@/components/delivery-prediction"
import RouteOptimization from "@/components/route-optimization"

interface AdvancedAnalyticsProps {
  period: string
  branch: string
}

export default function AdvancedAnalytics({ period, branch }: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("demand-forecast")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Leverage machine learning to optimize operations and predict future trends
          </p>
        </div>
        <Button variant="outline" size="sm">
          Refresh Analysis
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="demand-forecast" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Demand Forecast</span>
            <span className="sm:hidden">Demand</span>
          </TabsTrigger>
          <TabsTrigger value="resource-allocation" className="flex items-center">
            <Truck className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Resource Allocation</span>
            <span className="sm:hidden">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="delivery-prediction" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Delivery Prediction</span>
            <span className="sm:hidden">Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="route-optimization" className="flex items-center">
            <Map className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Route Optimization</span>
            <span className="sm:hidden">Routes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demand-forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Trend Forecasting</CardTitle>
              <CardDescription>
                AI-powered analysis of historical data to predict future demand patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemandForecast period={period} branch={branch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource-allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Season Resource Allocation</CardTitle>
              <CardDescription>Optimize resource distribution during high-demand periods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceAllocation period={period} branch={branch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery-prediction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Delay Prediction</CardTitle>
              <CardDescription>Identify potential delivery delays before they occur</CardDescription>
            </CardHeader>
            <CardContent>
              <DeliveryPrediction period={period} branch={branch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="route-optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Route Optimization</CardTitle>
              <CardDescription>Optimize delivery routes based on historical performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <RouteOptimization period={period} branch={branch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
