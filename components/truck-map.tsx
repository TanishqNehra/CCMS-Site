"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function TruckMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p>Loading map...</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="h-[500px] w-full bg-slate-100 rounded-lg overflow-hidden">
        {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
        <div className="w-full h-full bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center relative">
          {/* Truck markers */}
          <div className="absolute top-[30%] left-[25%] bg-white p-1 rounded-full border-2 border-green-500">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="absolute top-[45%] left-[40%] bg-white p-1 rounded-full border-2 border-amber-500">
            <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
          </div>
          <div className="absolute top-[60%] left-[70%] bg-white p-1 rounded-full border-2 border-amber-500">
            <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
          </div>
          <div className="absolute top-[25%] left-[60%] bg-white p-1 rounded-full border-2 border-red-500">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="absolute top-[70%] left-[30%] bg-white p-1 rounded-full border-2 border-green-500">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
        <div className="text-sm font-medium mb-2">Legend</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Available
            </Badge>
            <span className="text-xs text-muted-foreground">8 trucks</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              In Transit
            </Badge>
            <span className="text-xs text-muted-foreground">12 trucks</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-700">
              Maintenance
            </Badge>
            <span className="text-xs text-muted-foreground">4 trucks</span>
          </div>
        </div>
      </div>
    </div>
  )
}
