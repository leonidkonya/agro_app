import type { Plot } from "../types/plot"

export const defaultPlot: Plot = {
  id: "default-test-plot",
  name: "TestPlot1",
  coordinates: [
    [10.5, 7.5],
    [10.5045, 7.5],
    [10.5045, 7.5045],
    [10.5, 7.5045],
  ],
  area: 0.25, // 25 hectares = 0.25 km²
  latitude: 10.5,
  longitude: 7.5,
  isDefault: true,
}

export const getInitialPlots = (): Plot[] => {
  if (typeof window === "undefined") {
    return [defaultPlot]
  }

  const storedPlots = localStorage.getItem("userPlots")
  if (storedPlots) {
    const parsedPlots = JSON.parse(storedPlots)
    if (!parsedPlots.some((plot: Plot) => plot.id === defaultPlot.id)) {
      return [defaultPlot, ...parsedPlots]
    }
    return parsedPlots
  }
  return [defaultPlot]
}

export const savePlots = (plots: Plot[]) => {
  if (typeof window !== "undefined") {
    const plotsToSave = plots.some((plot) => plot.id === defaultPlot.id) ? plots : [defaultPlot, ...plots]
    localStorage.setItem("userPlots", JSON.stringify(plotsToSave))
  }
}

export function getDefaultSoilData() {
  return {
    pH: 6.5,
    "Nitrogen (N)": 150,
    "Phosphorus (P)": 30,
    "Potassium (K)": 150,
    "Organic Matter": 3,
    "Calcium (Ca)": 1500,
    "Magnesium (Mg)": 75,
    "Sulfur (S)": 15,
    "Zinc (Zn)": 3,
    "Manganese (Mn)": 35,
    "Copper (Cu)": 0.2,
    "Boron (B)": 0.75,
  }
}

