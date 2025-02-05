"use client"

import { Sun, Cloud, CloudRain, AlertCircle } from "lucide-react"
import type { Plot } from "../types/plot"
import { type WeatherData, getWeatherDescription } from "../services/weatherService"
import Link from "next/link"

interface WeatherWidgetProps {
  plot: Plot
  weatherData: WeatherData | null
  error: string | null
}

export default function WeatherWidget({ plot, weatherData, error }: WeatherWidgetProps) {
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    )
  }

  if (!weatherData) {
    return <p>Loading weather data...</p>
  }

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode < 3) return Sun
    if (weatherCode < 50) return Cloud
    return CloudRain
  }

  const WeatherIcon = getWeatherIcon(weatherData.weatherCode)

  return (
    <div className="space-y-4 text-sky-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <WeatherIcon className="w-10 h-10 text-sky-500 mr-2" />
          <div>
            <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
            <p className="text-sm">{getWeatherDescription(weatherData.weatherCode)}</p>
          </div>
        </div>
        <p className="text-sm">{plot.name}</p>
      </div>
      <div className="space-y-2">
        <p>Precipitation: {weatherData.precipitation} mm</p>
        <p>Wind Speed: {weatherData.windSpeed} km/h</p>
      </div>
      <Link href="/weather" className="text-sky-600 hover:underline">
        View detailed weather
      </Link>
    </div>
  )
}

