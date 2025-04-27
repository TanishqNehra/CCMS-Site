"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the chart
const monthlyRevenueData = [
  { month: "Jan", revenue: 42000, target: 40000 },
  { month: "Feb", revenue: 38000, target: 42000 },
  { month: "Mar", revenue: 45000, target: 43000 },
  { month: "Apr", revenue: 50000, target: 45000 },
  { month: "May", revenue: 55000, target: 47000 },
  { month: "Jun", revenue: 58000, target: 50000 },
  { month: "Jul", revenue: 62000, target: 52000 },
  { month: "Aug", revenue: 65000, target: 55000 },
  { month: "Sep", revenue: 68000, target: 57000 },
  { month: "Oct", revenue: 72000, target: 60000 },
  { month: "Nov", revenue: 75000, target: 62000 },
  { month: "Dec", revenue: 80000, target: 65000 },
]

const branchRevenueData = [
  { branch: "New York", revenue: 180000 },
  { branch: "Chicago", revenue: 150000 },
  { branch: "Los Angeles", revenue: 165000 },
  { branch: "Miami", revenue: 120000 },
  { branch: "Dallas", revenue: 135000 },
]

const serviceRevenueData = [
  { service: "Standard Delivery", revenue: 350000 },
  { service: "Express Delivery", revenue: 250000 },
  { service: "Same-Day Delivery", revenue: 150000 },
  { service: "International Shipping", revenue: 200000 },
]

export default function RevenueChart() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading chart...</p>
      </div>
    )
  }

  // Find the maximum revenue value for scaling
  const maxMonthlyRevenue = Math.max(...monthlyRevenueData.map((item) => Math.max(item.revenue, item.target)))
  const maxBranchRevenue = Math.max(...branchRevenueData.map((item) => item.revenue))
  const maxServiceRevenue = Math.max(...serviceRevenueData.map((item) => item.revenue))

  return (
    <div className="w-full">
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="branch">By Branch</TabsTrigger>
          <TabsTrigger value="service">By Service</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="w-full">
          <div className="h-[400px] flex flex-col">
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <div>Revenue</div>
              <div>Target</div>
            </div>
            <div className="flex items-end h-[350px] gap-2 mb-2">
              {monthlyRevenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex justify-center items-end h-[320px] relative">
                    <div
                      className="w-3 bg-green-500 rounded-t"
                      style={{
                        height: `${(item.revenue / maxMonthlyRevenue) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="absolute w-full border-t-2 border-dashed border-orange-400"
                      style={{
                        bottom: `${(item.target / maxMonthlyRevenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs">{item.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-medium">
              <div>${monthlyRevenueData[0].revenue.toLocaleString()}</div>
              <div>${monthlyRevenueData[monthlyRevenueData.length - 1].revenue.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Year-to-Date Revenue</h3>
              <p className="text-2xl font-bold">
                ${monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">YoY Growth</h3>
              <p className="text-2xl font-bold text-green-500">+18.5%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branch" className="w-full">
          <div className="h-[400px]">
            <div className="flex flex-col h-full">
              {branchRevenueData.map((item, index) => (
                <div key={index} className="flex items-center mb-4">
                  <div className="w-24 text-sm">{item.branch}</div>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.revenue / maxBranchRevenue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-24 text-right text-sm font-medium">${item.revenue.toLocaleString()}</div>
                </div>
              ))}
              <div className="mt-auto">
                <h3 className="text-sm font-medium mb-2">Total Revenue by Branch</h3>
                <p className="text-2xl font-bold">
                  ${branchRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="service" className="w-full">
          <div className="h-[400px]">
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="flex flex-col">
                {serviceRevenueData.map((item, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <div className="w-40 text-sm">{item.service}</div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(item.revenue / maxServiceRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-right text-sm font-medium">${item.revenue.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Service Distribution</h3>
                    <div className="w-48 h-48 mx-auto rounded-full border-8 border-slate-100 relative mb-4">
                      {serviceRevenueData.map((item, index) => {
                        const total = serviceRevenueData.reduce((sum, i) => sum + i.revenue, 0)
                        const percentage = (item.revenue / total) * 100
                        const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"]

                        return (
                          <div
                            key={index}
                            className={`absolute w-4 h-4 rounded-full ${colors[index % colors.length]}`}
                            style={{
                              top: `${50 - 40 * Math.cos((2 * Math.PI * index) / serviceRevenueData.length)}%`,
                              left: `${50 + 40 * Math.sin((2 * Math.PI * index) / serviceRevenueData.length)}%`,
                            }}
                          ></div>
                        )
                      })}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl font-bold">
                          ${serviceRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Revenue by Service Type</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
