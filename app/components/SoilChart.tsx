"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { soilParameters, cropOptimalRanges } from "../data/soilData"

interface SoilChartProps {
  soilData: { [key: string]: number }
  selectedParameter: string
  setSelectedParameter: (parameter: string) => void
  selectedCrop: string | null
  plotName: string
}

export default function SoilChart({
  soilData,
  selectedParameter,
  setSelectedParameter,
  selectedCrop,
  plotName,
}: SoilChartProps) {
  const chartData = [
    {
      name: plotName,
      value: soilData[selectedParameter] || 0,
    },
  ]

  const optimalRange = selectedCrop ? cropOptimalRanges[selectedCrop][selectedParameter] : null

  const getYAxisDomain = () => {
    const value = soilData[selectedParameter] || 0
    const parameterConfig = soilParameters.find((param) => param.name === selectedParameter)

    if (parameterConfig) {
      return [parameterConfig.minRange, parameterConfig.maxRange]
    }

    if (optimalRange) {
      return [Math.min(value, optimalRange.min) * 0.8, Math.max(value, optimalRange.max) * 1.2]
    }

    return [0, value * 1.2]
  }

  const yAxisDomain = getYAxisDomain()

  const getUnit = () => {
    const parameterConfig = soilParameters.find((param) => param.name === selectedParameter)
    return parameterConfig ? parameterConfig.unit : ""
  }

  const unit = getUnit()

  const barFill = optimalRange
    ? soilData[selectedParameter] >= optimalRange.min && soilData[selectedParameter] <= optimalRange.max
      ? "#4CAF50"
      : "#FFA000"
    : "#2196F3"

  return (
    <div className="space-y-4">
      <Select value={selectedParameter} onValueChange={setSelectedParameter}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a parameter" />
        </SelectTrigger>
        <SelectContent>
          {soilParameters.map((param) => (
            <SelectItem key={param.name} value={param.name}>
              {param.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={yAxisDomain}
              label={{ value: `${selectedParameter} (${unit})`, angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value) => [`${value} ${unit}`, selectedParameter]} labelFormatter={() => plotName} />
            {optimalRange && (
              <>
                <ReferenceLine
                  y={optimalRange.min}
                  stroke="#4CAF50"
                  strokeDasharray="3 3"
                  label={{ value: "Min", position: "insideTopLeft" }}
                />
                <ReferenceLine
                  y={optimalRange.max}
                  stroke="#4CAF50"
                  strokeDasharray="3 3"
                  label={{ value: "Max", position: "insideTopRight" }}
                />
              </>
            )}
            <Bar dataKey="value" fill={barFill} barSize={60}>
              <Label
                position="top"
                content={({ value }) => (
                  <text x={30} y={-10} fill="#000" textAnchor="middle">
                    {`${value} ${unit}`}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {optimalRange && (
        <div className="text-sm text-gray-600">
          Optimal range for {selectedCrop}: {optimalRange.min.toFixed(2)} - {optimalRange.max.toFixed(2)} {unit}
        </div>
      )}
    </div>
  )
}

