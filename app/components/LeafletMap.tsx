"use client"

import { useEffect, useRef, useState, useCallback } from "react"
// import L from "leaflet"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
  area: number
}

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  onAreaSelect?: (coordinates: [number, number][]) => void
  existingPlots?: Plot[]
  markers?: Array<{ position: [number, number]; popup?: string }>
  onPlotClick?: (plot: Plot) => void
  enablePlotSelection?: boolean
  sentinelHubLayer?: string | null
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  onAreaSelect,
  existingPlots = [],
  markers = [],
  onPlotClick,
  enablePlotSelection = false,
  sentinelHubLayer,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const polygonRef = useRef<L.Polygon | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [mapInitialized, setMapInitialized] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number][]>([])
  const sentinelHubLayerRef = useRef<L.ImageOverlay | null>(null)

  const initializeMap = useCallback(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapInitialized) return

    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current)

    setMapInitialized(true)
  }, [center, zoom, mapInitialized])

  useEffect(() => {
    if (typeof window !== "undefined" && !mapInitialized) {
      initializeMap()
    }
  }, [initializeMap, mapInitialized])

  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      mapRef.current.setView(center, zoom)
    }
  }, [center, zoom, mapInitialized])

  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      existingPlots.forEach((plot) => {
        const polygon = L.polygon(plot.coordinates, {
          color: "blue",
          weight: 2,
          fillOpacity: 0.2,
        })
          .addTo(mapRef.current!)
          .bindPopup(plot.name)

        if (onPlotClick) {
          polygon.on("click", () => onPlotClick(plot))
        }
      })

      markers.forEach((marker) => {
        L.marker(marker.position)
          .addTo(mapRef.current!)
          .bindPopup(marker.popup || "")
      })
    }
  }, [existingPlots, markers, mapInitialized, onPlotClick])

  useEffect(() => {
    if (mapRef.current && mapInitialized && sentinelHubLayer) {
      if (sentinelHubLayerRef.current) {
        mapRef.current.removeLayer(sentinelHubLayerRef.current)
      }

      const bounds = L.latLngBounds(existingPlots[0].coordinates)
      sentinelHubLayerRef.current = L.imageOverlay(sentinelHubLayer, bounds, { opacity: 0.7 }).addTo(mapRef.current)
    }
  }, [sentinelHubLayer, mapInitialized, existingPlots])

  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (!isDrawing) return

      const newCoordinates = [...currentCoordinates, [e.latlng.lat, e.latlng.lng] as [number, number]]
      setCurrentCoordinates(newCoordinates)

      if (mapRef.current) {
        if (polygonRef.current) {
          mapRef.current.removeLayer(polygonRef.current)
        }
        polygonRef.current = L.polygon(newCoordinates, { color: "red" }).addTo(mapRef.current)

        const marker = L.marker(e.latlng).addTo(mapRef.current)
        markersRef.current.push(marker)
      }
    },
    [isDrawing, currentCoordinates],
  )

  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      if (isDrawing) {
        mapRef.current.on("click", handleMapClick)
      } else {
        mapRef.current.off("click", handleMapClick)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick)
      }
    }
  }, [isDrawing, mapInitialized, handleMapClick])

  const toggleDrawing = () => {
    if (isDrawing) {
      // Finish drawing
      if (currentCoordinates.length >= 3 && onAreaSelect) {
        onAreaSelect(currentCoordinates)
      }
      setCurrentCoordinates([])
      if (polygonRef.current && mapRef.current) {
        mapRef.current.removeLayer(polygonRef.current)
      }
      markersRef.current.forEach((marker) => {
        if (mapRef.current) mapRef.current.removeLayer(marker)
      })
      markersRef.current = []
    }
    setIsDrawing(!isDrawing)
  }

  const undoLastPoint = () => {
    if (currentCoordinates.length > 0) {
      const newCoordinates = currentCoordinates.slice(0, -1)
      setCurrentCoordinates(newCoordinates)

      if (mapRef.current) {
        if (polygonRef.current) {
          mapRef.current.removeLayer(polygonRef.current)
        }
        if (newCoordinates.length >= 2) {
          polygonRef.current = L.polygon(newCoordinates, { color: "red" }).addTo(mapRef.current)
        }

        const lastMarker = markersRef.current.pop()
        if (lastMarker) mapRef.current.removeLayer(lastMarker)
      }
    }
  }

  return (
    <div className={`relative ${isDrawing ? "cursor-default" : ""}`}>
      <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />
      {enablePlotSelection && (
        <div className="absolute top-2 left-2 z-[1000] space-y-2">
          <Button onClick={toggleDrawing} variant={isDrawing ? "destructive" : "default"}>
            {isDrawing ? "Finish Drawing" : "Start Drawing"}
          </Button>
          {isDrawing && (
            <Button onClick={undoLastPoint} variant="secondary">
              Undo Last Point
            </Button>
          )}
        </div>
      )}
      <style jsx global>{`
        .leaflet-container {
          cursor: grab;
        }
        .cursor-default .leaflet-container {
          cursor: default !important;
        }
      `}</style>
    </div>
  )
}

export default LeafletMap

