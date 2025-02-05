"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Replace with your actual Mapbox access token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"

interface SatelliteMapProps {
  center: [number, number]
  zoom: number
}

export default function SatelliteMap({ center, zoom }: SatelliteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: center,
        zoom: zoom,
      })
    }
  }, [center, zoom])

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({ center: center, zoom: zoom })
    }
  }, [center, zoom])

  return <div ref={mapContainer} className="h-64 w-full rounded-lg overflow-hidden" />
}

