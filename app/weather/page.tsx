"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { fetchWeatherData, type WeatherData, getWeatherDescription } from "../services/weatherService"
import type { Plot } from "../types/plot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getInitialPlots } from "../data/defaultPlot"

const OpenLayersMap = dynamic(() => import("../components/OpenLayersMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export default function Weather() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        .catch((error) => setError(error.message))
    }
  }, [selectedPlot])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Weather Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weather Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              {selectedPlot ? (
                <OpenLayersMap
                  center={[selectedPlot.latitude, selectedPlot.longitude]}
                  zoom={13}
                  markers={[{ position: [selectedPlot.latitude, selectedPlot.longitude], popup: selectedPlot.name }]}
                  existingPlots={[selectedPlot]}
                  enablePlotSelection={false}
                  weatherData={weatherData}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <p>No plot selected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plot Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPlot?.id || ""}
                onChange={(e) => setSelectedPlot(plots.find((plot) => plot.id === e.target.value) || null)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a plot</option>
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name} {plot.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : weatherData ? (
            <Card>
              <CardHeader>
                <CardTitle>Weather Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Temperature: {weatherData.temperature}°C</p>
                <p>Precipitation: {weatherData.precipitation} mm</p>
                <p>Wind Speed: {weatherData.windSpeed} km/h</p>
                <p>Conditions: {getWeatherDescription(weatherData.weatherCode)}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <p>Select a plot to view weather data</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

