"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
  area: number
}

interface AddPlotModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPlot: (plot: Plot) => void
  existingPlots: Plot[]
}

const AddPlotModal: React.FC<AddPlotModalProps> = ({ isOpen, onClose, onAddPlot, existingPlots }) => {
  const [selectedArea, setSelectedArea] = useState<[number, number][]>([])
  const [plotName, setPlotName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAreaSelect = (coordinates: [number, number][]) => {
    setSelectedArea(coordinates)
    setError(null)
  }

  const calculateArea = (coords: [number, number][]): number => {
    let area = 0
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length
      area += coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1]
    }
    return (Math.abs(area) / 2) * 111.32 * 111.32 // Rough conversion to square kilometers
  }

  const handleAddPlot = () => {
    if (selectedArea.length < 3) {
      setError("Please select a valid area on the map.")
      return
    }

    if (!plotName) {
      setError("Please enter a name for your plot.")
      return
    }

    const newPlotArea = calculateArea(selectedArea)
    const totalArea = existingPlots.reduce((sum, plot) => sum + plot.area, 0) + newPlotArea

    if (newPlotArea < 0.001) {
      // 0.1 hectares = 0.001 km²
      setError("The selected area is too small. Minimum plot size is 0.1 hectares.")
      return
    }

    if (totalArea > 1) {
      // 100 hectares = 1 km²
      setError("Total area exceeds 100 hectares. Please select a smaller area.")
      return
    }

    const newPlot: Plot = {
      id: Date.now().toString(),
      name: plotName,
      coordinates: selectedArea,
      area: newPlotArea,
    }

    onAddPlot(newPlot)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Add New Plot</DialogTitle>
          <DialogDescription>
            Draw a polygon on the map to select your plot. Minimum size: 0.1 hectares. Maximum total area: 100 hectares.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="plotName"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              className="col-span-3"
              placeholder="Enter plot name"
            />
          </div>
          <div className="h-[400px]">
            <LeafletMap
              center={[9.082, 8.6753]}
              zoom={6}
              onAreaSelect={handleAreaSelect}
              existingPlots={existingPlots}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <Button onClick={handleAddPlot}>Add Plot</Button>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlotModal

