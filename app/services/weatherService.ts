import type { Plot } from "../types/plot"

const API_ENDPOINT = "https://api.open-meteo.com/v1/forecast"

export interface WeatherData {
  temperature: number
  precipitation: number
  windSpeed: number
  weatherCode: number
}

export async function fetchWeatherData(plot: Plot): Promise<WeatherData> {
  const { latitude, longitude } = calculatePlotCentroid(plot)

  const url = new URL(API_ENDPOINT)
  url.searchParams.append("latitude", latitude.toString())
  url.searchParams.append("longitude", longitude.toString())
  url.searchParams.append("current_weather", "true")
  url.searchParams.append("hourly", "temperature_2m,precipitation,windspeed_10m")

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error("Weather data is currently unavailable. Please try again later.")
    }
    const data = await response.json()

    return {
      temperature: data.current_weather.temperature,
      precipitation: data.hourly.precipitation[0],
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw new Error("Weather data is currently unavailable. Please try again later.")
  }
}

function calculatePlotCentroid(plot: Plot): { latitude: number; longitude: number } {
  const lats = plot.coordinates.map((coord) => coord[0])
  const longs = plot.coordinates.map((coord) => coord[1])
  const latitude = lats.reduce((a, b) => a + b) / lats.length
  const longitude = longs.reduce((a, b) => a + b) / longs.length
  return { latitude, longitude }
}

export function getWeatherDescription(weatherCode: number): string {
  // Weather code descriptions based on WMO standards
  const weatherDescriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
  }

  return weatherDescriptions[weatherCode] || "Unknown"
}

