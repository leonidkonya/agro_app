"use client"

import { useState, useEffect } from "react"
import { SentinelHubViewer } from "../components/SentinelHubViewer"
import { getInitialPlots, defaultPlot } from "../data/defaultPlot"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function GISPage() {
  const [plots, setPlots] = useState<(typeof defaultPlot)[]>([defaultPlot])
  const [selectedPlot, setSelectedPlot] = useState(defaultPlot)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const initialPlots = getInitialPlots()
    setPlots(initialPlots)
    setSelectedPlot(initialPlots[0])
  }, [])

  const getBoundingBox = (coordinates: [number, number][]): number[] => {
    const lngs = coordinates.map((coord) => coord[1])
    const lats = coordinates.map((coord) => coord[0])
    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPlot.id}
            onValueChange={(value) => setSelectedPlot(plots.find((p) => p.id === value) || plots[0])}
          >
            <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select a plot" />
            </SelectTrigger>
            <SelectContent>
              {plots.map((plot) => (
                <SelectItem key={plot.id} value={plot.id}>
                  {plot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-4">
            <span className="text-white">Opacity:</span>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[opacity]}
              onValueChange={([value]) => setOpacity(value)}
              className="w-32"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 relative">
        <SentinelHubViewer
          bbox={getBoundingBox(selectedPlot.coordinates)}
          fromTime={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)}
          toTime={new Date()}
          opacity={opacity}
        />
      </div>
    </div>
  )
}

