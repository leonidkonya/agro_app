import { soilParameters, cropOptimalRanges } from "../data/soilData"

interface InsightsPanelProps {
  soilData: { [key: string]: number }
  selectedCrop: string
}

export default function InsightsPanel({ soilData, selectedCrop }: InsightsPanelProps) {
  const insights = soilParameters
    .map((param) => {
      const measuredValue = soilData[param.name] || 0
      const optimalRange = cropOptimalRanges[selectedCrop][param.name]

      if (measuredValue < optimalRange.min) {
        return `${param.name} is below the optimal range for ${selectedCrop}. Consider increasing ${param.name} levels.`
      } else if (measuredValue > optimalRange.max) {
        return `${param.name} is above the optimal range for ${selectedCrop}. Consider reducing ${param.name} levels.`
      }
      return null
    })
    .filter(Boolean)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recommendations:</h3>
      {insights.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      ) : (
        <p>All soil parameters are within optimal ranges for {selectedCrop}.</p>
      )}
    </div>
  )
}

