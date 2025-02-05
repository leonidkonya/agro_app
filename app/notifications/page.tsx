"use client"

import { useState } from "react"
import { AlertTriangle, Bell, X } from "lucide-react"

interface Notification {
  id: number
  message: string
  type: "warning" | "info"
  date: string
}

const initialNotifications: Notification[] = [
  { id: 1, message: "Upcoming Storm: Prepare your fields", type: "warning", date: "2023-06-15" },
  { id: 2, message: "Low Soil pH Detected in North Field", type: "warning", date: "2023-06-14" },
  { id: 3, message: "Optimal planting time for corn approaching", type: "info", date: "2023-06-13" },
  { id: 4, message: "Irrigation system maintenance required", type: "info", date: "2023-06-12" },
  { id: 5, message: "Pest infestation risk high in South Pasture", type: "warning", date: "2023-06-11" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No notifications at this time.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {notification.type === "warning" ? (
                  <AlertTriangle className="w-6 h-6 text-orange-500 mt-1" />
                ) : (
                  <Bell className="w-6 h-6 text-blue-500 mt-1" />
                )}
                <div className="flex-grow">
                  <p
                    className={`font-semibold ${notification.type === "warning" ? "text-orange-700 dark:text-orange-300" : "text-black dark:text-white"}`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{notification.date}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

