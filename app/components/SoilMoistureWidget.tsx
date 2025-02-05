"use client"

import { Droplet } from "lucide-react"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
}

interface SoilMoistureWidgetProps {
  plot: Plot
}

export default function SoilMoistureWidget({ plot }: SoilMoistureWidgetProps) {
  // In a real application, you would fetch soil moisture data based on the plot's location
  const soilMoistureData = {
    percentage: 65,
    status: "Optimal",
    history: [
      { date: "2023-06-01", value: 60 },
      { date: "2023-06-02", value: 62 },
      { date: "2023-06-03", value: 65 },
    ],
  }

  return (
    <div className="space-y-4 text-emerald-800">
      <div className="flex items-center">
        <Droplet className="w-10 h-10 text-emerald-500 mr-4" />
        <div>
          <p className="text-2xl font-bold">{soilMoistureData.percentage}%</p>
          <p className="text-sm">{soilMoistureData.status}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Recent History:</p>
        {soilMoistureData.history.map((entry, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{entry.date}</span>
            <span>{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

