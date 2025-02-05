"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInitialPlots, savePlots } from "../data/defaultPlot"
import type { Plot } from "../types/plot"

const StaticMap = dynamic(() => import("../components/StaticMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export default function Plots() {
  const [plots, setPlots] = useState<Plot[]>([])

  useEffect(() => {
    const loadPlots = () => {
      const initialPlots = getInitialPlots()
      // Remove duplicates based on plot id
      const uniquePlots = Array.from(new Map(initialPlots.map((plot) => [plot.id, plot])).values())
      setPlots(uniquePlots)
    }

    loadPlots()

    // Set up an interval to check for new plots every 5 seconds
    const intervalId = setInterval(loadPlots, 5000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Save plots whenever the plots state changes
    savePlots(plots)
  }, [plots])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Plots Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plots.map((plot) => (
          <Card key={plot.id}>
            <CardHeader>
              <CardTitle>
                {plot.name} {plot.isDefault ? "(Default)" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 mb-4">
                <StaticMap center={[plot.latitude, plot.longitude]} zoom={13} plot={plot} />
              </div>
              <p>Area: {plot.area.toFixed(2)} km²</p>
              <p>
                Coordinates:{" "}
                {plot.coordinates.map((coord) => `[${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}]`).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

