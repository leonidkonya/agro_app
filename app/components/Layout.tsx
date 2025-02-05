"use client"

import { useState, useCallback } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { useTheme } from "../contexts/ThemeContext"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useTheme()

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prevState) => !prevState)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className={`flex h-screen bg-background ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 flex flex-col relative">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4" onClick={closeSidebar}>
          {children}
        </main>
        {sidebarOpen && <div className="absolute inset-0 bg-black bg-opacity-50 z-40" onClick={closeSidebar} />}
      </div>
    </div>
  )
}

