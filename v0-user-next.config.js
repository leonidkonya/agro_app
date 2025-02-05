/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
    NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_ID,
    NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET: process.env.NEXT_PUBLIC_SENTINEL_HUB_CLIENT_SECRET,
  },
}

module.exports = nextConfig

