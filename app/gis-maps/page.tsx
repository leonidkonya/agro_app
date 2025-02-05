"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Replace with your actual Mapbox access token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"

export default function GISMaps() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [lng, lat],
        zoom: zoom,
      })
    }
  }, [lng, lat, zoom])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">GIS Maps</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div ref={mapContainer} className="h-96" />
      </div>
    </div>
  )
}

