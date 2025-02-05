"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Widget = {
  id: string
  name: string
  enabled: boolean
}

const defaultWidgets: Widget[] = [
  { id: "weather", name: "Weather", enabled: true },
  { id: "soilMoisture", name: "Soil Moisture", enabled: true },
  { id: "notifications", name: "Notifications", enabled: true },
  { id: "cropCalendar", name: "Crop Calendar", enabled: true },
]

export default function DashboardSettings() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const storedWidgets = localStorage.getItem("dashboardWidgets")
    if (storedWidgets) {
      setWidgets(JSON.parse(storedWidgets))
    }
  }, [])

  const toggleWidget = (id: string) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget,
    )
    setWidgets(updatedWidgets)
    localStorage.setItem("dashboardWidgets", JSON.stringify(updatedWidgets))
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-primary text-white">
        Dashboard Settings
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dashboard Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between">
                <Label
                  htmlFor={widget.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {widget.name}
                </Label>
                <Switch id={widget.id} checked={widget.enabled} onCheckedChange={() => toggleWidget(widget.id)} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

