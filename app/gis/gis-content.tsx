"use client"

import { useState, useEffect, useRef } from "react"
import { layers } from "../services/sentinelHubService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getInitialPlots } from "../data/defaultPlot"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import ImageLayer from "ol/layer/Image"
import XYZ from "ol/source/XYZ"
import ImageWMS from "ol/source/ImageWMS"
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
  area: number
  latitude: number
  longitude: number
  isDefault?: boolean
}

const SENTINEL_HUB_URL = `https://services.sentinel-hub.com/ogc/wms/${process.env.NEXT_PUBLIC_SENTINEL_HUB_INSTANCE_ID}`

export default function GISContent() {
  const [selectedLayer, setSelectedLayer] = useState(layers[0].id)
  const [plots, setPlots] = useState<Plot[]>([])
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)

  useEffect(() => {
    const initialPlots = getInitialPlots()
    setPlots(initialPlots)
    if (initialPlots.length > 0) {
      setSelectedPlot(initialPlots[0])
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Create Esri base layer
    const esriLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles © Esri",
      }),
      zIndex: 0,
    })

    // Create vector layer for plots
    const vectorSource = new VectorSource()
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: "rgba(255, 255, 0, 0.2)" }),
        stroke: new Stroke({ color: "#ffcc33", width: 2 }),
      }),
      zIndex: 2,
    })

    // Initialize map
    const initialMap = new Map({
      target: mapRef.current,
      layers: [esriLayer, vectorLayer],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    })

    mapInstanceRef.current = initialMap

    // Add plot features
    plots.forEach((plot) => {
      const feature = new Feature({
        geometry: new Polygon([plot.coordinates.map((coord) => fromLonLat(coord))]),
      })
      feature.setProperties({ plot: plot })
      vectorSource.addFeature(feature)
    })

    // Set up click handler
    initialMap.on("click", (event) => {
      initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        const plot = feature.getProperties().plot
        if (plot) setSelectedPlot(plot)
      })
    })

    return () => {
      initialMap.setTarget(undefined)
    }
  }, [plots])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Remove existing Sentinel Hub layer
    mapInstanceRef.current
      .getLayers()
      .getArray()
      .filter((layer) => layer instanceof ImageLayer)
      .forEach((layer) => mapInstanceRef.current!.removeLayer(layer))

    // Add new Sentinel Hub layer
    const sentinelHubLayer = new ImageLayer({
      source: new ImageWMS({
        url: SENTINEL_HUB_URL,
        params: {
          LAYERS: selectedLayer,
          TRANSPARENT: true,
        },
        ratio: 1,
        serverType: "geoserver",
      }),
      opacity: 0.7,
      zIndex: 1,
    })

    mapInstanceRef.current.addLayer(sentinelHubLayer)
  }, [selectedLayer])

  useEffect(() => {
    if (mapInstanceRef.current && selectedPlot) {
      const view = mapInstanceRef.current.getView()
      view.animate({
        center: fromLonLat([selectedPlot.longitude, selectedPlot.latitude]),
        zoom: 13,
        duration: 1000,
      })
    }
  }, [selectedPlot])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">GIS Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px]">
            <div ref={mapRef} className="w-full h-full" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layer Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a layer" />
                </SelectTrigger>
                <SelectContent>
                  {layers.map((layer) => (
                    <SelectItem key={layer.id} value={layer.id}>
                      {layer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plot Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPlot?.id || ""}
                onValueChange={(value) => setSelectedPlot(plots.find((plot) => plot.id === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plot" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} {plot.isDefault ? "(Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedPlot && (
            <Card>
              <CardHeader>
                <CardTitle>Plot Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Name: {selectedPlot.name}</p>
                <p>Area: {selectedPlot.area.toFixed(2)} km²</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

