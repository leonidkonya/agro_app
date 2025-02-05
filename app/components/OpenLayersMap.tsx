"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorSource from "ol/source/Vector"
import { Feature } from "ol"
import { Polygon } from "ol/geom"
import { fromLonLat, toLonLat } from "ol/proj"
import Draw from "ol/interaction/Draw"
import Modify from "ol/interaction/Modify"
import Snap from "ol/interaction/Snap"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Check, X } from "lucide-react"
import ImageLayer from "ol/layer/Image"
import ImageStatic from "ol/source/ImageStatic"
// import type { Layer } from "ol/layer/Layer"
import Layer from "ol/layer/Layer"
import XYZ from "ol/source/XYZ"
import VectorLayer from "ol/layer/Vector"
import { Style, Fill, Stroke } from "ol/style"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
}

interface OpenLayersMapProps {
  center: [number, number]
  zoom: number
  onAreaSelect?: (coordinates: [number, number][]) => void
  existingPlots?: Plot[]
  enablePlotSelection?: boolean
  onPlotClick?: (plot: Plot) => void
  onPlotEdit?: (plot: Plot) => void
  onPlotDelete?: (plotId: string) => void
  sentinelHubLayer?: string | null
  additionalLayers?: Layer[]
}

const esriSatelliteLayer = new TileLayer({
  source: new XYZ({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attributions: "Tiles © Esri",
  }),
  zIndex: 0,
  name: "EsriSatellite",
})

const applyBaseLayer = (map: Map) => {
  const layers = map.getLayers().getArray()
  const esriExists = layers.some((layer) => layer.get("name") === "EsriSatellite")

  if (!esriExists) {
    console.log("Esri layer does not exist, adding it now")
    map.getLayers().insertAt(0, esriSatelliteLayer)
  } else {
    console.log("Esri layer already exists")
  }
  console.log(
    "Current layers after applying base layer:",
    map
      .getLayers()
      .getArray()
      .map((layer) => layer.get("name")),
  )
}

const OpenLayersMap: React.FC<OpenLayersMapProps> = ({
  center,
  zoom,
  onAreaSelect,
  existingPlots = [],
  enablePlotSelection = false,
  onPlotClick,
  onPlotEdit,
  onPlotDelete,
  sentinelHubLayer,
  additionalLayers,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null)
  const [modifyInteraction, setModifyInteraction] = useState<Modify | null>(null)
  const [snapInteraction, setSnapInteraction] = useState<Snap | null>(null)
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const sentinelHubLayerRef = useRef<ImageLayer<ImageStatic> | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    console.log("Initializing map")
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
      zIndex: 2,
    })

    const initialLayers = [esriSatelliteLayer]
    if (additionalLayers) {
      initialLayers.push(...additionalLayers)
    }
    initialLayers.push(vectorLayer)

    const initialMap = new Map({
      target: mapRef.current,
      layers: initialLayers,
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    })

    console.log(
      "Initial layers:",
      initialMap
        .getLayers()
        .getArray()
        .map((layer) => layer.get("name")),
    )
    applyBaseLayer(initialMap)

    setMap(initialMap)
    setVectorSource(vectorSource)

    return () => {
      initialMap.setTarget(undefined)
    }
  }, [center, zoom, additionalLayers])

  useEffect(() => {
    if (!map || !vectorSource) return

    vectorSource.clear()

    existingPlots.forEach((plot) => {
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
            setSelectedPlot(plot)
          }
        })
      })
    }
  }, [map, existingPlots, onPlotClick, vectorSource])

  useEffect(() => {
    if (map) {
      map.getView().setCenter(fromLonLat(center))
      map.getView().setZoom(zoom)
      applyBaseLayer(map)
    }
  }, [map, center, zoom])

  useEffect(() => {
    if (map && sentinelHubLayer) {
      if (sentinelHubLayerRef.current) {
        map.removeLayer(sentinelHubLayerRef.current)
      }

      const extent = map.getView().calculateExtent(map.getSize())
      console.log("Adding Sentinel Hub layer:", sentinelHubLayer)
      console.log("Current layers before adding:", map.getLayers().getArray())
      sentinelHubLayerRef.current = new ImageLayer({
        source: new ImageStatic({
          url: sentinelHubLayer,
          imageExtent: extent,
        }),
        opacity: 0.7,
        zIndex: 1,
      })

      map.addLayer(sentinelHubLayerRef.current)
      applyBaseLayer(map)
      console.log("Layers after adding Sentinel Hub and applying base layer:", map.getLayers().getArray())
    }
  }, [map, sentinelHubLayer])

  const startDrawing = () => {
    if (!map || !vectorSource) return

    const draw = new Draw({
      source: vectorSource,
      type: "Polygon",
    })

    const snap = new Snap({ source: vectorSource })

    map.addInteraction(draw)
    map.addInteraction(snap)

    setDrawInteraction(draw)
    setSnapInteraction(snap)
    setIsDrawing(true)

    draw.on("drawend", (event) => {
      const feature = event.feature
      const geometry = feature.getGeometry() as Polygon
      const coordinates = geometry.getCoordinates()[0].map((coord) => toLonLat(coord) as [number, number])
      if (onAreaSelect) {
        onAreaSelect(coordinates)
      }
      setIsDrawing(false)
      map.removeInteraction(draw)
      map.removeInteraction(snap)
    })
  }

  const cancelDrawing = () => {
    if (!map || !drawInteraction || !snapInteraction) return

    map.removeInteraction(drawInteraction)
    map.removeInteraction(snapInteraction)
    setIsDrawing(false)
  }

  const startEditing = () => {
    if (!map || !vectorSource || !selectedPlot) return

    const modify = new Modify({ source: vectorSource })
    const snap = new Snap({ source: vectorSource })

    map.addInteraction(modify)
    map.addInteraction(snap)

    setModifyInteraction(modify)
    setSnapInteraction(snap)
    setIsEditing(true)

    modify.on("modifyend", (event) => {
      const features = event.features.getArray()
      if (features.length > 0) {
        const geometry = features[0].getGeometry() as Polygon
        const coordinates = geometry.getCoordinates()[0].map((coord) => toLonLat(coord) as [number, number])
        if (onPlotEdit) {
          onPlotEdit({ ...selectedPlot, coordinates })
        }
      }
    })
  }

  const finishEditing = () => {
    if (!map || !modifyInteraction || !snapInteraction) return

    map.removeInteraction(modifyInteraction)
    map.removeInteraction(snapInteraction)
    setIsEditing(false)
  }

  const deletePlot = () => {
    if (!selectedPlot || !onPlotDelete) return

    onPlotDelete(selectedPlot.id)
    setSelectedPlot(null)
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      <div className="absolute top-2 left-2 z-10 space-y-2">
        {enablePlotSelection && !isDrawing && !isEditing && <Button onClick={startDrawing}>Draw Plot</Button>}
        {isDrawing && (
          <>
            <Button onClick={cancelDrawing} variant="destructive">
              Cancel
            </Button>
          </>
        )}
        {selectedPlot && !isEditing && (
          <>
            <Button onClick={startEditing}>
              <Edit size={16} className="mr-2" />
              Edit Plot
            </Button>
            <Button onClick={deletePlot} variant="destructive">
              <Trash2 size={16} className="mr-2" />
              Delete Plot
            </Button>
          </>
        )}
        {isEditing && (
          <>
            <Button onClick={finishEditing}>
              <Check size={16} className="mr-2" />
              Finish Editing
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="secondary">
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default OpenLayersMap

