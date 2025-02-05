"use client"

import { useState, useEffect } from "react"
import { Share2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ShareDataModal from "../components/ShareDataModal"
import UploadSoilDataModal from "../components/UploadSoilDataModal"
import SoilAnalysisVisualization from "../components/SoilAnalysisVisualization"
import type { Plot } from "../types/plot"
import { soilParameters, crops } from "../data/soilData"
import { getInitialPlots, getDefaultSoilData } from "../data/defaultPlot"

export default function SoilAnalysis() {
  const [selectedParameter, setSelectedParameter] = useState(soilParameters[0].name)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [plots, setPlots] = useState<Plot[]>([])
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [soilData, setSoilData] = useState<{ [key: string]: number }>({})
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)

  useEffect(() => {
    const initialPlots = getInitialPlots()
    setPlots(initialPlots)
    if (initialPlots.length > 0) {
      setSelectedPlot(initialPlots[0])
    }
  }, [])

  useEffect(() => {
    if (selectedPlot) {
      const storedSoilData = localStorage.getItem(`soilData_${selectedPlot.id}`)
      if (storedSoilData) {
        setSoilData(JSON.parse(storedSoilData))
      } else if (selectedPlot.isDefault) {
        const defaultSoilData = getDefaultSoilData()
        setSoilData(defaultSoilData)
        localStorage.setItem(`soilData_${selectedPlot.id}`, JSON.stringify(defaultSoilData))
      } else {
        const randomSoilData = generateRandomSoilData()
        setSoilData(randomSoilData)
        localStorage.setItem(`soilData_${selectedPlot.id}`, JSON.stringify(randomSoilData))
      }
    } else {
      setSoilData({})
    }
  }, [selectedPlot])

  const generateRandomSoilData = () => {
    const newSoilData: { [key: string]: number } = {}
    const defaultData = getDefaultSoilData()
    Object.keys(defaultData).forEach((param) => {
      const defaultValue = defaultData[param]
      newSoilData[param] = defaultValue * (0.8 + Math.random() * 0.4) // Random value between 80% and 120% of default
    })
    return newSoilData
  }

  const handleUploadSoilData = (data: { [key: string]: number }) => {
    setSoilData(data)
    if (selectedPlot) {
      localStorage.setItem(`soilData_${selectedPlot.id}`, JSON.stringify(data))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white">Soil Analysis</h1>
        <div className="flex space-x-4">
          <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center">
            <Upload className="mr-2" size={20} />
            Upload Data
          </Button>
          <Button onClick={() => setIsShareModalOpen(true)} className="flex items-center">
            <Share2 className="mr-2" size={20} />
            Share Data
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plot Selection</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {selectedPlot && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crop Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCrop || "No crop selected"}
              onValueChange={(value) => setSelectedCrop(value === "No crop selected" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No crop selected">No crop selected</SelectItem>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedPlot ? (
        <SoilAnalysisVisualization soilData={soilData} selectedCrop={selectedCrop} plotName={selectedPlot.name} />
      ) : (
        <Alert>
          <AlertDescription>Please select a plot to view soil analysis data.</AlertDescription>
        </Alert>
      )}

      <ShareDataModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} dataType="Soil Analysis" />
      <UploadSoilDataModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSoilData}
        parameters={soilParameters.map((param) => param.name)}
      />
    </div>
  )
}

