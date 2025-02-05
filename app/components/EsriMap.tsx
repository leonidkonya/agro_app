"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
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

interface EsriMapProps {
  center: [number, number]
  zoom: number
  plots: Plot[]
  onPlotClick?: (plot: Plot) => void
  additionalLayers?: any[]
}

const EsriMap: React.FC<EsriMapProps> = ({ center, zoom, plots, onPlotClick, additionalLayers = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    console.log("Initializing EsriMap")

    const esriLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles © Esri",
      }),
      zIndex: 0,
      name: "EsriSatellite",
    })

    console.log("Esri layer created:", esriLayer)

    const vectorSource = new VectorSource()
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 0, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
      }),
      zIndex: 5, // Set z-index between base layer and Sentinel layer
    })

    // Create map with explicit layer order
    const initialMap = new Map({
      target: mapRef.current,
      layers: [esriLayer], // Add Esri layer first
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    })

    // Add vector layer after initialization
    initialMap.addLayer(vectorLayer)

    // Add additional layers last
    additionalLayers.forEach((layer) => {
      initialMap.addLayer(layer)
    })

    console.log(
      "Initial layers:",
      initialMap
        .getLayers()
        .getArray()
        .map((layer) => layer.get("name")),
    )

    setMap(initialMap)

    return () => {
      initialMap.setTarget(undefined)
    }
  }, [center, zoom, additionalLayers])

  useEffect(() => {
    if (!map) return

    const vectorSource = (map.getLayers().getArray()[1] as VectorLayer<VectorSource>).getSource()
    if (!vectorSource) return

    vectorSource.clear()

    plots.forEach((plot) => {
      const feature = new Feature({
        geometry: new Polygon([plot.coordinates.map((coord) => fromLonLat(coord))]),
      })
      feature.setProperties({ plot: plot })
      vectorSource.addFeature(feature)
    })

    if (onPlotClick) {
      map.on("click", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const plot = feature.getProperties().plot
          if (plot) {
            onPlotClick(plot)
          }
        })
      })
    }
  }, [map, plots, onPlotClick])

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
}

export default EsriMap

