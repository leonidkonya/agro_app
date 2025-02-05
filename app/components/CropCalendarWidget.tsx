"use client"

import { Calendar } from "lucide-react"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
}

interface CropCalendarWidgetProps {
  plot: Plot
}

export default function CropCalendarWidget({ plot }: CropCalendarWidgetProps) {
  // In a real application, you would fetch crop calendar data based on the plot's crops and location
  const cropCalendarData = [
    { crop: "Corn", planting: "April", growth: "May-August", harvest: "September" },
    { crop: "Soybeans", planting: "May", growth: "June-August", harvest: "October" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Crop Calendar for {plot.name}</h3>
      </div>
      <div className="space-y-2">
        {cropCalendarData.map((crop, index) => (
          <div key={index} className="text-sm">
            <p className="font-semibold">{crop.crop}</p>
            <p>Planting: {crop.planting}</p>
            <p>Growth: {crop.growth}</p>
            <p>Harvest: {crop.harvest}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

