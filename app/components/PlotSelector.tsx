"use client"

import { useState, useEffect } from "react"
import { getInitialPlots } from "../data/defaultPlot"
import type { Plot } from "../types/plot"

export default function PlotSelector() {
  const [plots, setPlots] = useState<Plot[]>([])
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)

  useEffect(() => {
    const initialPlots = getInitialPlots()
    setPlots(initialPlots)
    if (initialPlots.length > 0) {
      setSelectedPlot(initialPlots[0])
    }
  }, [])

  return (
    <div className="relative inline-block text-left">
      <select
        value={selectedPlot?.id || ""}
        onChange={(e) => {
          const plot = plots.find((p) => p.id === e.target.value)
          if (plot) setSelectedPlot(plot)
        }}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        {plots.map((plot) => (
          <option key={plot.id} value={plot.id}>
            {plot.name} {plot.isDefault ? "(Default)" : ""}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}

