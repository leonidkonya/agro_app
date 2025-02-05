export function getCredentials() {
  if (typeof window !== "undefined") {
    return {
      CLIENT_ID:
        sessionStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID") || process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
      CLIENT_SECRET:
        sessionStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET") ||
        process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
    }
  }
  return {
    CLIENT_ID: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
    CLIENT_SECRET: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
  }
}

