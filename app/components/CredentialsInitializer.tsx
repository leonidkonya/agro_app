"use client"

import { useEffect } from "react"
import { setCredentials } from "../utils/credentials"

export function CredentialsInitializer() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET
    if (clientId && clientSecret) {
      setCredentials(clientId, clientSecret)
    }
  }, [])

  return null
}

