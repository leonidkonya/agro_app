"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { soilParameters, cropOptimalRanges } from "../data/soilData"
import SoilChart from "./SoilChart"
import SoilDataTable from "./SoilDataTable"
import InsightsPanel from "./InsightsPanel"

interface SoilAnalysisVisualizationProps {
  soilData: { [key: string]: number }
  selectedCrop: string | null
  plotName: string
}

export default function SoilAnalysisVisualization({
  soilData,
  selectedCrop,
  plotName,
}: SoilAnalysisVisualizationProps) {
  const [selectedParameter, setSelectedParameter] = useState(soilParameters[0].name)

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Soil Analysis for {plotName}</CardTitle>
        </CardHeader>
        <CardContent>
          <SoilChart
            soilData={soilData}
            selectedParameter={selectedParameter}
            setSelectedParameter={setSelectedParameter}
            selectedCrop={selectedCrop}
            plotName={plotName}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Data</CardTitle>
        </CardHeader>
        <CardContent>
          <SoilDataTable soilData={soilData} selectedCrop={selectedCrop} />
        </CardContent>
      </Card>

      {selectedCrop && (
        <Card>
          <CardHeader>
            <CardTitle>Insights and Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <InsightsPanel soilData={soilData} selectedCrop={selectedCrop} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

