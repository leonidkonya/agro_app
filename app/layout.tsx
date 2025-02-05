import "./globals.css"
import "leaflet/dist/leaflet.css"
import { Inter } from "next/font/google"
import Layout from "./components/Layout"
import { ThemeProvider } from "./contexts/ThemeContext"
import { CredentialsInitializer } from "./components/CredentialsInitializer"
import "react-leaflet"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Agricultural AI App",
  description: "Empowering farmers with data-driven insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CredentialsInitializer />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}

