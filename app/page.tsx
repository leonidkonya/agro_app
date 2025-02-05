"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import WeatherWidget from "./components/WeatherWidget"
import SoilMoistureWidget from "./components/SoilMoistureWidget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Plot } from "./types/plot"
import { fetchWeatherData, type WeatherData } from "./services/weatherService"
import { getInitialPlots } from "./data/defaultPlot"
import { DashboardNavigation } from "./components/DashboardNavigation"

const OpenLayersMap = dynamic(() => import("./components/OpenLayersMap"), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-100">Loading map...</div>,
})

export default function Dashboard() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  useEffect(() => {
    const initialPlots = getInitialPlots()
    setPlots(initialPlots)
    if (initialPlots.length > 0) {
      setSelectedPlot(initialPlots[0])
    }
  }, [])

  useEffect(() => {
    if (selectedPlot) {
      fetchWeatherData(selectedPlot)
        .then(setWeatherData)
        .catch((error) => setWeatherError(error.message))
    }
  }, [selectedPlot])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Dashboard</h1>

      <DashboardNavigation />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Field Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 mb-4">
              {selectedPlot ? (
                <OpenLayersMap
                  center={[selectedPlot.latitude, selectedPlot.longitude]}
                  zoom={13}
                  markers={[{ position: [selectedPlot.latitude, selectedPlot.longitude], popup: selectedPlot.name }]}
                  existingPlots={[selectedPlot]}
                  enablePlotSelection={false}
                  additionalLayers={[]}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No plot selected</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Select
                value={selectedPlot?.id || ""}
                onValueChange={(value) => setSelectedPlot(plots.find((plot) => plot.id === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plot" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} {plot.isDefault ? "(Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="bg-sky-50">
            <CardHeader>
              <CardTitle className="text-sky-700">Weather</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlot && <WeatherWidget plot={selectedPlot} weatherData={weatherData} error={weatherError} />}
            </CardContent>
          </Card>
          <Card className="bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">Soil Moisture</CardTitle>
            </CardHeader>
            <CardContent>{selectedPlot && <SoilMoistureWidget plot={selectedPlot} />}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

