import { Lightbulb } from "lucide-react"

interface Plot {
  id: number
  name: string
  center: [number, number]
  bounds: [number, number][]
}

interface RecommendationsWidgetProps {
  plot: Plot
}

export default function RecommendationsWidget({ plot }: RecommendationsWidgetProps) {
  // In a real application, you would generate recommendations based on the plot's data
  const recommendations = ["Optimal time for nitrogen application", "Consider irrigation in the next 48 hours"]

  return (
    <div className="bg-white dark:bg-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Recommendations for {plot.name}</h2>
      {recommendations.map((recommendation, index) => (
        <div key={index} className="flex items-center mb-4 last:mb-0">
          <Lightbulb className="w-8 h-8 text-yellow-500 mr-4" />
          <p className="text-gray-800">{recommendation}</p>
        </div>
      ))}
    </div>
  )
}

