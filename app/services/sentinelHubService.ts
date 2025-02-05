import type { SentinelHubLayer } from "@/types/sentinelHub"
import { getCredentials } from "../utils/credentials"

export const layers: SentinelHubLayer[] = [
  {
    id: "NDVI",
    name: "Normalized Difference Vegetation Index",
    collection: "S2L2A",
    evalscript: `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B08"],
          output: { bands: 3 }
        };
      }

      function evaluatePixel(sample) {
        let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
        if (ndvi < 0.2) return [0.8, 0, 0];  // Red (Bare soil)
        if (ndvi < 0.5) return [1, 1, 0];  // Yellow (Moderate vegetation)
        return [0, 0.8, 0];  // Green (Healthy vegetation)
      }
    `,
  },
  {
    id: "EVI",
    name: "Enhanced Vegetation Index",
    collection: "S2L2A",
    evalscript: `
      //VERSION=3
      function setup() {
        return {
          input: ["B02", "B04", "B08"],
          output: { bands: 3 }
        };
      }

      function evaluatePixel(sample) {
        let evi = 2.5 * (sample.B08 - sample.B04) / (sample.B08 + 6 * sample.B04 - 7.5 * sample.B02 + 1);
        if (evi < 0.2) return [0.6, 0, 0];  // Dark Red (Low EVI)
        if (evi < 0.5) return [1, 0.5, 0];  // Orange (Moderate EVI)
        return [0, 0.6, 0];  // Dark Green (High EVI)
      }
    `,
  },
  {
    id: "SLOPE",
    name: "Slope",
    collection: "DEM",
    evalscript: "",
  },
  {
    id: "ROUGHNESS",
    name: "Roughness Index",
    collection: "DEM",
    evalscript: "",
  },
  {
    id: "WATER_FLOW",
    name: "Water Flow",
    collection: "DEM",
    evalscript: "",
  },
]

export async function getSentinelHubLayer(
  layerId: string,
  bbox: number[],
  fromTime: Date,
  toTime: Date,
): Promise<{ url: string; format: string; metadata?: any }> {
  const layer = layers.find((l) => l.id === layerId)
  if (!layer) {
    throw new Error(`Layer ${layerId} not found`)
  }

  if (layer.collection === "DEM" && layer.id !== "ELEVATION") {
    const response = await fetch("/api/getDEMData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bbox,
        layer: layer.id,
        fromTime: fromTime.toISOString(),
        toTime: toTime.toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch DEM data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { url: data.url, format: "image/tiff" }
  }

  const token = await getAuthToken()
  const response = await fetch("https://services.sentinel-hub.com/api/v1/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      input: {
        bounds: {
          bbox: bbox,
          properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
        },
        data: [
          {
            dataFilter: {
              timeRange: {
                from: fromTime.toISOString(),
                to: toTime.toISOString(),
              },
            },
            type: layer.collection,
          },
        ],
      },
      output: {
        width: 1024,
        height: 1024,
        responses: [
          {
            identifier: "default",
            format: { type: "image/png" },
          },
        ],
      },
      evalscript: layer.evalscript,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Sentinel Hub layer: ${response.status} ${response.statusText}`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return { url, format: "image/png" }
}

async function getAuthToken(): Promise<string> {
  const { CLIENT_ID, CLIENT_SECRET } = getCredentials()

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Sentinel Hub credentials are not set")
  }

  const response = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to obtain auth token: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

