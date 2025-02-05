"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Plot } from "../../types/plot"

const OpenLayersMap = dynamic(() => import("../../components/OpenLayersMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export default function AddPlot() {
  const router = useRouter()
  const [selectedArea, setSelectedArea] = useState<[number, number][]>([])
  const [plotName, setPlotName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const calculateArea = (coords: [number, number][]): number => {
    if (coords.length < 3) return 0

    let area = 0
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length
      area += (coords[i][1] + coords[j][1]) * (coords[j][0] - coords[i][0])
    }
    area = Math.abs(area) / 2

    // Convert to square kilometers (approximate)
    const earthRadius = 6371 // km
    return area * (Math.PI / 180) * earthRadius * earthRadius
  }

  const handleAreaSelect = (coordinates: [number, number][]) => {
    setSelectedArea(coordinates)
    setError(null)
  }

  const handleAddPlot = () => {
    if (selectedArea.length < 3) {
      setError("Please draw a polygon on the map to select your plot area.")
      return
    }

    if (!plotName.trim()) {
      setError("Please enter a name for your plot.")
      return
    }

    const areaInKm2 = calculateArea(selectedArea)
    const areaInHectares = areaInKm2 * 100 // 1 km² = 100 hectares

    if (areaInHectares < 0.1) {
      setError("The selected area is too small. Minimum plot size is 0.1 hectares.")
      return
    }

    if (areaInHectares > 100) {
      setError("Selected area exceeds 100 hectares. Please select a smaller area.")
      return
    }

    const { latitude, longitude } = calculatePlotCentroid(selectedArea)

    const newPlot: Plot = {
      id: Date.now().toString(),
      name: plotName.trim(),
      coordinates: selectedArea,
      area: areaInKm2,
      latitude,
      longitude,
    }

    const existingPlots = JSON.parse(localStorage.getItem("userPlots") || "[]")
    const totalArea = existingPlots.reduce((sum: number, plot: Plot) => sum + plot.area, 0) * 100

    if (totalArea + areaInHectares > 100) {
      setError("Total area of all plots would exceed 100 hectares. Please select a smaller area.")
      return
    }

    localStorage.setItem("userPlots", JSON.stringify([...existingPlots, newPlot]))
    setSuccess(`Plot "${newPlot.name}" has been successfully added.`)
    setTimeout(() => {
      router.push("/plots")
    }, 2000)
  }

  const calculatePlotCentroid = (coordinates: [number, number][]): { latitude: number; longitude: number } => {
    const lats = coordinates.map((coord) => coord[0])
    const longs = coordinates.map((coord) => coord[1])
    const latitude = lats.reduce((a, b) => a + b) / lats.length
    const longitude = longs.reduce((a, b) => a + b) / longs.length
    return { latitude, longitude }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Plot</CardTitle>
          <CardDescription>
            Draw a polygon on the map to select your plot. Minimum size: 0.1 hectares. Maximum total area: 100 hectares.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <Input placeholder="Enter plot name" value={plotName} onChange={(e) => setPlotName(e.target.value)} />
            </div>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Use the plot selection tool in the map to draw and save your plot.
            </div>
            <div className="h-[500px] w-full border rounded-md overflow-hidden">
              <OpenLayersMap
                center={[9.082, 8.6753]}
                zoom={6}
                onAreaSelect={handleAreaSelect}
                enablePlotSelection={true}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                <Check className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {selectedArea.length > 0 && (
              <Alert>
                <AlertDescription>
                  Selected area: {(calculateArea(selectedArea) * 100).toFixed(2)} hectares
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleAddPlot}>Add Plot</Button>
            <div className="flex justify-between">
              <Link href="/plots" className="text-primary hover:underline">
                View All Plots
              </Link>
              <Link href="/gis" className="text-primary hover:underline">
                View in GIS
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

