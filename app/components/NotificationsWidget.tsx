"use client"

import { AlertTriangle, Bell } from "lucide-react"

interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
}

interface NotificationsWidgetProps {
  plot: Plot
}

export default function NotificationsWidget({ plot }: NotificationsWidgetProps) {
  // In a real application, you would fetch notifications based on the plot's data
  const notifications = [
    { type: "warning", message: "High risk of pest infestation in the next 48 hours" },
    { type: "info", message: "Optimal time for fertilizer application approaching" },
    { type: "warning", message: "Soil moisture levels dropping below optimal range" },
  ]

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <div key={index} className="flex items-start space-x-2">
          {notification.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
          ) : (
            <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
          )}
          <p className="text-sm">{notification.message}</p>
        </div>
      ))}
    </div>
  )
}

