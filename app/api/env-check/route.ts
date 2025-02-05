import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET

  console.log("Server-side CLIENT_ID:", clientId)
  console.log("Server-side CLIENT_SECRET:", clientSecret ? "Set (value hidden)" : "Not set")

  return NextResponse.json({
    clientIdSet: !!clientId,
    clientSecretSet: !!clientSecret,
    clientId: clientId,
    clientSecret: clientSecret ? "Set (value hidden)" : "Not set",
  })
}

