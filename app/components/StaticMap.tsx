"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Feature } from "ol"
import { Polygon } from "ol/geom"
import { fromLonLat } from "ol/proj"
import { Style, Fill, Stroke } from "ol/style"
import type { Plot } from "../types/plot"
import XYZ from "ol/source/XYZ"

interface StaticMapProps {
  center: [number, number]
  zoom: number
  plot: Plot
}

const StaticMap: React.FC<StaticMapProps> = ({ center, zoom, plot }) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const vectorSource = new VectorSource({
      features: [
        new Feature({
          geometry: new Polygon([plot.coordinates.map((coord) => fromLonLat(coord))]),
        }),
      ],
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 0, 0.2)", // Yellow fill with some transparency
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
      }),
    })

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: "Tiles © Esri",
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
      controls: [],
      interactions: [],
    })

    // Fit the view to the plot's extent
    const extent = vectorSource.getExtent()
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50], // Increased padding
      maxZoom: 18,
      minZoom: 8, // Added minimum zoom level
      constrainResolution: true, // Ensures smooth zoom levels
    })

    return () => {
      map.setTarget(undefined)
    }
  }, [center, zoom, plot])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}

export default StaticMap

