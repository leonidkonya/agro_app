interface Plot {
  id: number
  name: string
  center: [number, number]
  bounds: [number, number][]
}

interface CropCalendarProps {
  plot: Plot
}

// Mock data for crop calendar
const cropCalendarData = [
  { crop: "Corn", planting: "April", growth: "May-August", harvest: "September-October" },
  { crop: "Soybeans", planting: "May", growth: "June-August", harvest: "September-October" },
  { crop: "Wheat", planting: "September-October", growth: "November-June", harvest: "July" },
  { crop: "Alfalfa", planting: "April", growth: "May-September", harvest: "June-October (multiple cuttings)" },
]

const CropCalendar: React.FC<CropCalendarProps> = ({ plot }) => {
  return (
    <div className="bg-white dark:bg-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-black">Crop Calendar for {plot.name}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-300">
              <th className="py-2 px-4 text-left text-gray-800">Crop</th>
              <th className="py-2 px-4 text-left text-gray-800">Planting</th>
              <th className="py-2 px-4 text-left text-gray-800">Growth</th>
              <th className="py-2 px-4 text-left text-gray-800">Harvest</th>
            </tr>
          </thead>
          <tbody>
            {cropCalendarData.map((crop, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-100" : "bg-white dark:bg-gray-200"}>
                <td className="py-2 px-4 text-gray-800">{crop.crop}</td>
                <td className="py-2 px-4 text-gray-800">{crop.planting}</td>
                <td className="py-2 px-4 text-gray-800">{crop.growth}</td>
                <td className="py-2 px-4 text-gray-800">{crop.harvest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CropCalendar

