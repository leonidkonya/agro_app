"use client"

import { useEffect, useRef } from "react"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"
import { fromLonLat } from "ol/proj"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Feature } from "ol"
import { Polygon } from "ol/geom"
import { Style, Fill, Stroke } from "ol/style"
import "ol/ol.css"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
}

interface BaseMapProps {
  center: [number, number]
  zoom: number
  plots?: Plot[]
  onPlotClick?: (plot: Plot) => void
  additionalLayers?: any[]
}

const BaseMap = ({ center, zoom, plots = [], onPlotClick, additionalLayers = [] }: BaseMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create the Esri base layer
    const esriLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles © Esri",
      }),
      zIndex: 0,
    })

    console.log("Created Esri layer:", esriLayer)

    // Create vector layer for plots
    const vectorSource = new VectorSource()
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: "rgba(255, 255, 0, 0.2)" }),
        stroke: new Stroke({ color: "#ffcc33", width: 2 }),
      }),
      zIndex: 1,
    })

    // Initialize map with Esri layer
    const map = new Map({
      target: mapRef.current,
      layers: [esriLayer], // Start with only Esri layer
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    })

    console.log("Map initialized with Esri layer")

    // Add vector layer
    map.addLayer(vectorLayer)
    console.log("Added vector layer")

    // Add additional layers
    additionalLayers.forEach((layer, index) => {
      map.addLayer(layer)
      console.log(`Added additional layer ${index}`)
    })

    // Add plot features
    plots.forEach((plot) => {
      const feature = new Feature({
        geometry: new Polygon([plot.coordinates.map((coord) => fromLonLat(coord))]),
      })
      feature.setProperties({ plot: plot })
      vectorSource.addFeature(feature)
    })

    console.log("Added plot features")

    // Set up click handler
    if (onPlotClick) {
      map.on("click", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const plot = feature.getProperties().plot
          if (plot) onPlotClick(plot)
        })
      })
    }

    // Store map instance
    mapInstance.current = map

    // Log final layer configuration
    console.log(
      "Final layer configuration:",
      map
        .getLayers()
        .getArray()
        .map((layer) => ({
          zIndex: layer.getZIndex(),
          source: layer.getSource()?.constructor.name,
        })),
    )

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined)
      }
    }
  }, [center, zoom, plots, additionalLayers, onPlotClick]) // Added additionalLayers to dependency array

  // Handle updates to center and zoom
  useEffect(() => {
    if (!mapInstance.current) return

    const view = mapInstance.current.getView()
    view.animate({
      center: fromLonLat(center),
      zoom: zoom,
      duration: 250,
    })
  }, [center, zoom])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  )
}

export default BaseMap

