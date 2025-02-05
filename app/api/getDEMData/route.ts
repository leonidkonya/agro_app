import { NextResponse } from "next/server"
import { getCredentials } from "@/app/utils/credentials"

const evalscripts: { [key: string]: string } = {
  SLOPE: `//VERSION=3
  function setup() {
    return { input: ["DEM"], output: { bands: 1, sampleType: "FLOAT32" } };
  }
  function evaluatePixel(sample) {
    return [Math.atan(sample.DEM) * 57.2958]; // Convert radians to degrees
  }
`,
  ASPECT: `//VERSION=3
function setup() {
  return { input: ["DEM"], output: { bands: 1, sampleType: "FLOAT32" } };
}
function evaluatePixel(sample) {
  let dx = (sample.DEM[1] - sample.DEM[-1]) / 2; // Central difference for X gradient
  let dy = (sample.DEM[-2] - sample.DEM[2]) / 2; // Central difference for Y gradient

  let aspect = Math.atan2(dy, dx) * (180 / Math.PI);

  if (aspect < 0) aspect += 360;
  if (isNaN(aspect)) aspect = 180;

  // Force more variation in aspect values
  let stretchedAspect = ((aspect - 180) / 180) * 255;
  return [stretchedAspect];
}
`,
  ROUGHNESS: `//VERSION=3
  function setup() {
    return { input: ["DEM"], output: { bands: 1, sampleType: "FLOAT32" } };
  }
  function evaluatePixel(sample) {
    return [sample.DEM * 0.01]; // Approximate roughness
  }
`,
  WATER_FLOW: `//VERSION=3
  function setup() {
    return { input: ["DEM"], output: { bands: 1, sampleType: "FLOAT32" } };
  }
  function evaluatePixel(sample) {
    return [Math.max(0, sample.DEM - 100) / 1000]; // Simplified water flow calculation
  }
`,
}

export async function POST(request: Request) {
  try {
    const { bbox, layer, fromTime, toTime } = await request.json()
    const { CLIENT_ID, CLIENT_SECRET } = getCredentials()

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Sentinel Hub credentials are not set")
      return NextResponse.json({ error: "Sentinel Hub credentials are not set" }, { status: 400 })
    }

    console.log(`Processing DEM Layer: ${layer}`)

    // Get auth token
    const tokenResponse = await fetch("https://services.sentinel-hub.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text()
      console.error("Failed to obtain auth token:", tokenError)
      return NextResponse.json({ error: `Failed to obtain auth token: ${tokenError}` }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()
    const token = tokenData.access_token

    // Process DEM data
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
                  from: fromTime,
                  to: toTime,
                },
              },
              type: "DEM",
            },
          ],
        },
        output: {
          width: 256,
          height: 256,
          responses: [{ identifier: "default", format: { type: "image/tiff" } }],
        },
        evalscript: evalscripts[layer],
      }),
    })

    if (!response.ok) {
      const responseError = await response.text()
      console.error("Sentinel-Hub API Error:", responseError)
      return NextResponse.json({ error: `Failed to fetch DEM data: ${responseError}` }, { status: 500 })
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength === 0) {
      console.error("Empty TIFF file received from Sentinel-Hub API")
      return NextResponse.json({ error: "Received empty TIFF file." }, { status: 500 })
    }

    console.log("Successfully retrieved TIFF file")
    const base64Image = Buffer.from(buffer).toString("base64")
    const imageUrl = `data:image/tiff;base64,${base64Image}`

    console.log(`Generated Image URL for ${layer}`)

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Error in getDEMData:", error)
    return NextResponse.json(
      { error: `Failed to process DEM data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

