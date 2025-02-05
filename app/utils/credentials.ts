// export function getCredentials() {
//   if (typeof window !== "undefined") {
//     return {
//       CLIENT_ID:
//         sessionStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID") || process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
//       CLIENT_SECRET:
//         sessionStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET") ||
//         process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
//     }
//   }
//   return {
//     CLIENT_ID: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
//     CLIENT_SECRET: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
//   }
// }



export function getCredentials() {
  if (typeof window !== "undefined") {
    return {
      CLIENT_ID:
        localStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID") ||
        process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID ||
        "",
      CLIENT_SECRET:
        localStorage.getItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET") ||
        process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET ||
        "",
    }
  }
  return {
    CLIENT_ID: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET || "",
  }
}




export function setCredentials(clientId: string, clientSecret: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID", clientId)
    localStorage.setItem("NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET", clientSecret)
  }
}