"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Use the environment variable for the access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

interface Plot {
  id: number
  name: string
  coordinates: [number, number][]
}

interface MapComponentProps {
  plots: Plot[]
  selectedPlot: Plot
}

export default function MapComponent({ plots, selectedPlot }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    if (map.current) return // initialize map only once

    const initializeMap = () => {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/satellite-v9",
          center: selectedPlot.coordinates[0],
          zoom: 12,
        })

        map.current.on("style.load", () => {
          addPlotLayers()
        })

        map.current.on("error", (e) => {
          console.error("Mapbox error:", e)
          setMapError("Failed to load the map. Please check your Mapbox access token and try again.")
        })
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError("Failed to initialize the map. Please check your connection and try again.")
      }
    }

    const addPlotLayers = () => {
      if (!map.current) return

      // Add source and layer for plots
      map.current.addSource("plots", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: plots.map((plot) => ({
            type: "Feature",
            properties: { id: plot.id, name: plot.name },
            geometry: {
              type: "Polygon",
              coordinates: [plot.coordinates],
            },
          })),
        },
      })

      map.current.addLayer({
        id: "plots-fill",
        type: "fill",
        source: "plots",
        paint: {
          "fill-color": ["case", ["==", ["get", "id"], selectedPlot.id], "#ff0000", "#0000ff"],
          "fill-opacity": 0.5,
        },
      })

      map.current.addLayer({
        id: "plots-outline",
        type: "line",
        source: "plots",
        paint: {
          "line-color": "#000000",
          "line-width": 2,
        },
      })
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [plots, selectedPlot])

  useEffect(() => {
    if (!map.current) return

    map.current.once("style.load", () => {
      map.current!.flyTo({
        center: selectedPlot.coordinates[0],
        zoom: 14,
        essential: true,
      })

      if (map.current!.getLayer("plots-fill")) {
        map.current!.setPaintProperty("plots-fill", "fill-color", [
          "case",
          ["==", ["get", "id"], selectedPlot.id],
          "#ff0000",
          "#0000ff",
        ])
      }
    })
  }, [selectedPlot])

  if (mapError) {
    return (
      <div className="h-96 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-red-500">{mapError}</p>
      </div>
    )
  }

  return <div ref={mapContainer} className="h-96 w-full rounded-lg overflow-hidden" />
}

