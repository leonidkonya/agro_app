"use client"

import { useState, useEffect, useRef } from "react"
import { getSentinelHubLayer, layers, type SentinelHubLayer } from "../services/sentinelHubService"
import { Camera, Layers, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import ImageLayer from "ol/layer/Image"
import XYZ from "ol/source/XYZ"
import ImageStatic from "ol/source/ImageStatic"
import { transformExtent } from "ol/proj"
import { buffer as olBuffer, getCenter } from "ol/extent"
import "ol/ol.css"
import { fromArrayBuffer } from "geotiff"

interface SentinelHubViewerProps {
  bbox: number[]
  fromTime: Date
  toTime: Date
  opacity: number
}

function base64ToBlob(base64: string, contentType = "image/tiff") {
  const byteCharacters = atob(base64)
  const byteArrays = []
  const sliceSize = 512

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  return new Blob(byteArrays, { type: contentType })
}

async function convertGeoTiffToCanvas(geoTiffImage: any) {
  const width = geoTiffImage.getWidth()
  const height = geoTiffImage.getHeight()
  const rasters = await geoTiffImage.readRasters({ interleave: true })
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get 2D context from canvas")
  const imageData = ctx.createImageData(width, height)

  // Find min and max values for normalization
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (let i = 0; i < width * height; i++) {
    const value = rasters[i]
    if (value < min) min = value
    if (value > max) max = value
  }

  // Normalize and set pixel values
  for (let i = 0; i < width * height; i++) {
    const value = rasters[i]
    const normalizedValue = Math.round(((value - min) / (max - min)) * 255)
    const index = i * 4
    imageData.data[index] = normalizedValue // Red
    imageData.data[index + 1] = normalizedValue // Green
    imageData.data[index + 2] = normalizedValue // Blue
    imageData.data[index + 3] = 255 // Alpha
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

async function loadGeoTIFF(rawUrl: string) {
  let tiffUrl = rawUrl
  if (rawUrl.startsWith("data:")) {
    const base64Data = rawUrl.split(",")[1]
    const blob = base64ToBlob(base64Data, "image/tiff")
    tiffUrl = URL.createObjectURL(blob)
  }

  const response = await fetch(tiffUrl)
  const arrayBuffer = await response.arrayBuffer()
  const tiff = await fromArrayBuffer(arrayBuffer)
  const geoTiffImage = await tiff.getImage()

  const width = geoTiffImage.getWidth()
  const height = geoTiffImage.getHeight()
  console.log("GeoTIFF size:", width, "x", height)

  const [originX, originY] = geoTiffImage.getOrigin()
  const [resolutionX, resolutionY] = geoTiffImage.getResolution()

  const minX = originX
  const maxX = originX + resolutionX * width

  let minY, maxY
  if (resolutionY < 0) {
    maxY = originY
    minY = originY + resolutionY * height
  } else {
    minY = originY
    maxY = originY + resolutionY * height
  }

  const extent = [minX, minY, maxX, maxY]
  console.log("Computed extent:", extent)

  const canvas = await convertGeoTiffToCanvas(geoTiffImage)

  return {
    getImage: () => canvas,
    getSize: () => [canvas.width, canvas.height],
    extent: extent,
  }
}

function normalizeElevationData(data: Uint8ClampedArray): Uint8ClampedArray {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i]
    min = Math.min(min, value)
    max = Math.max(max, value)
  }

  const normalizedData = new Uint8ClampedArray(data.length)
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i]
    const normalizedValue = Math.round(((value - min) / (max - min)) * 255)
    normalizedData[i] = normalizedValue
    normalizedData[i + 1] = normalizedValue
    normalizedData[i + 2] = normalizedValue
    normalizedData[i + 3] = 255
  }
  return normalizedData
}

export function SentinelHubViewer({ bbox, fromTime, toTime, opacity }: SentinelHubViewerProps) {
  const [selectedLayer, setSelectedLayer] = useState<SentinelHubLayer>(layers[0])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isImageryOpen, setIsImageryOpen] = useState(true)
  const [isLayerOpen, setIsLayerOpen] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const extent = transformExtent(bbox, "EPSG:4326", "EPSG:3857")
      const bufferedExtent = olBuffer(extent, 5000)

      // Create Esri base layer
      const esriLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attributions: "Tiles © Esri",
        }),
        zIndex: 0,
      })

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [esriLayer],
        view: new View({
          center: getCenter(bufferedExtent),
          extent: bufferedExtent,
          zoom: 12,
        }),
      })
    }
  }, [bbox])

  useEffect(() => {
    async function fetchLayer() {
      if (!mapInstanceRef.current) return

      setLoading(true)
      setError(null)

      try {
        console.log(`Fetching layer: ${selectedLayer.id}`)
        const { url, format, metadata } = await getSentinelHubLayer(selectedLayer.id, bbox, fromTime, toTime)
        console.log(`Received URL: ${url}, Format: ${format}, Metadata:`, metadata)

        // Remove existing Sentinel Hub layer
        mapInstanceRef.current
          .getLayers()
          .getArray()
          .filter((layer) => layer instanceof ImageLayer)
          .forEach((layer) => mapInstanceRef.current!.removeLayer(layer))

        const extent = transformExtent(bbox, "EPSG:4326", "EPSG:3857")
        let newLayer: ImageLayer<ImageStatic>

        if (selectedLayer.id === "NDVI" || selectedLayer.id === "EVI") {
          newLayer = new ImageLayer({
            source: new ImageStatic({
              url: url,
              imageExtent: extent,
              projection: "EPSG:3857",
            }),
            opacity,
            zIndex: 1,
          })
        } else if (selectedLayer.id === "ELEVATION") {
          const response = await fetch(url)
          const blob = await response.blob()
          const imageBitmap = await createImageBitmap(blob)

          const canvas = document.createElement("canvas")
          canvas.width = metadata.width
          canvas.height = metadata.height
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Could not get 2D context from canvas")

          ctx.drawImage(imageBitmap, 0, 0)
          const imageData = ctx.getImageData(0, 0, metadata.width, metadata.height)
          const normalizedData = normalizeElevationData(imageData.data)

          for (let i = 0; i < normalizedData.length; i += 4) {
            imageData.data[i] = normalizedData[i]
            imageData.data[i + 1] = normalizedData[i]
            imageData.data[i + 2] = normalizedData[i]
          }

          ctx.putImageData(imageData, 0, 0)

          newLayer = new ImageLayer({
            source: new ImageStatic({
              url: canvas.toDataURL(),
              imageExtent: transformExtent(metadata.bbox, "EPSG:4326", "EPSG:3857"),
              projection: "EPSG:3857",
            }),
            opacity,
          })
        } else if (format === "image/tiff") {
          try {
            console.log("Loading GeoTIFF...")
            const tileImage = await loadGeoTIFF(url)

            newLayer = new ImageLayer({
              source: new ImageStatic({
                url: tileImage.getImage().toDataURL(),
                imageExtent: tileImage.extent,
                projection: "EPSG:4326",
              }),
              opacity,
            })

            // Fit the view to the image extent
            mapInstanceRef.current.getView().fit(transformExtent(tileImage.extent, "EPSG:4326", "EPSG:3857"), {
              padding: [50, 50, 50, 50],
              maxZoom: 18,
            })
          } catch (tiffError) {
            console.error("Error loading GeoTIFF:", tiffError)
            throw new Error(`Failed to load GeoTIFF: ${tiffError.message}`)
          }
        } else {
          newLayer = new ImageLayer({
            source: new ImageStatic({ url, imageExtent: extent }),
            opacity,
            zIndex: 1,
          })
        }

        mapInstanceRef.current.addLayer(newLayer)

        mapInstanceRef.current.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 18,
          duration: 1000,
        })
      } catch (err) {
        console.error(`Error fetching ${selectedLayer.id}:`, err)
        setError(`Error loading ${selectedLayer.name}: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchLayer()
  }, [selectedLayer, bbox, fromTime, toTime, opacity])

  return (
    <div className="relative h-full">
      <div className="absolute left-4 top-4 z-10 w-64 bg-white rounded-lg shadow-lg">
        <Collapsible open={isImageryOpen} onOpenChange={setIsImageryOpen}>
          <CollapsibleTrigger className="flex items-center w-full px-4 py-3 hover:bg-gray-50">
            <Camera className="h-5 w-5 mr-2" />
            <span className="flex-1 text-left">Imagery</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${isImageryOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2 space-y-2">
            <div className="text-sm text-gray-600">
              <p>Sentinel-2 Imagery</p>
              <p>{currentDate.toLocaleDateString()}</p>
              <p className="mt-2">This image contains approximately 0% clouds.</p>
              <button className="text-blue-500 hover:underline mt-1">Learn more</button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isLayerOpen} onOpenChange={setIsLayerOpen}>
          <CollapsibleTrigger className="flex items-center w-full px-4 py-3 hover:bg-gray-50 border-t">
            <Layers className="h-5 w-5 mr-2" />
            <span className="flex-1 text-left">{selectedLayer.name}</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${isLayerOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2 space-y-2">
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedLayer.id === layer.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
            {selectedLayer.id === "NDVI" && (
              <div className="mt-4 p-4 border-t">
                <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded" />
                <div className="flex justify-between text-xs mt-1">
                  <span>WORSE</span>
                  <span>BETTER</span>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div ref={mapRef} className="w-full h-full">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
            Loading...
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-8 h-8 bg-white rounded-sm shadow flex items-center justify-center hover:bg-gray-100">
          +
        </button>
        <button className="w-8 h-8 bg-white rounded-sm shadow flex items-center justify-center hover:bg-gray-100">
          -
        </button>
      </div>
    </div>
  )
}

