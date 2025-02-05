import type React from "react"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
  area: number
}

interface PlotListProps {
  plots: Plot[]
}

const PlotList: React.FC<PlotListProps> = ({ plots }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Your Plots</h2>
      {plots.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You haven't added any plots yet.</p>
      ) : (
        <ul className="space-y-4">
          {plots.map((plot) => (
            <li key={plot.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold text-black dark:text-white">{plot.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Area: {plot.area.toFixed(4)} km² ({(plot.area * 100).toFixed(2)} hectares)
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Coordinates:{" "}
                {plot.coordinates.map((coord) => `[${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}]`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PlotList

