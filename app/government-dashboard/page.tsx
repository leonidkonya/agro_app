"use client"

import { useState } from "react"
import { MapPin, BarChart2, TrendingUp } from "lucide-react"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false })
const ChartComponent = dynamic(() => import("../components/Chart"), { ssr: false })

const regions = ["North", "South", "East", "West", "Central"]
const cropTypes = ["Corn", "Wheat", "Soybeans", "Rice", "Cotton"]

export default function GovernmentDashboard() {
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedCrop, setSelectedCrop] = useState("All")

  // Mock data - replace with actual data fetching logic
  const mockYieldData = {
    labels: regions,
    data: [7.2, 6.8, 7.5, 6.5, 7.0],
  }

  const mockSoilFertilityData = {
    labels: regions,
    data: [75, 68, 82, 70, 78],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Government Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            <MapPin className="inline-block mr-2" />
            Interactive GIS Map
          </h2>
          <div className="h-96">
            <MapComponent plots={[]} selectedPlot={null} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            <BarChart2 className="inline-block mr-2" />
            Yield Trends
          </h2>
          <ChartComponent
            data={mockYieldData.data}
            labels={mockYieldData.labels}
            title="Average Yield (tons/ha)"
            type="bar"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          <TrendingUp className="inline-block mr-2" />
          Statistical Breakdowns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black dark:text-white">Filters</h3>
            <div className="mb-4">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region:
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Crop Type:
              </label>
              <select
                id="crop"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Crops</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-black dark:text-white">Soil Fertility</h3>
            <ChartComponent
              data={mockSoilFertilityData.data}
              labels={mockSoilFertilityData.labels}
              title="Soil Fertility Index"
              type="line"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Policy Simulation Tool</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Simulate the impact of policy changes on agricultural outcomes. Select a scenario and adjust parameters to see
          projected results.
        </p>
        {/* Add policy simulation tool components here */}
      </div>
    </div>
  )
}

