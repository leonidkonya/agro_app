import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { soilParameters, cropOptimalRanges } from "../data/soilData"

interface SoilDataTableProps {
  soilData: { [key: string]: number }
  selectedCrop: string | null
}

export default function SoilDataTable({ soilData, selectedCrop }: SoilDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parameter</TableHead>
          <TableHead>Measured Value</TableHead>
          {selectedCrop && <TableHead>Optimal Range</TableHead>}
          {selectedCrop && <TableHead>Status</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {soilParameters.map((param) => {
          const measuredValue = soilData[param.name] || 0
          const optimalRange = selectedCrop ? cropOptimalRanges[selectedCrop][param.name] : null
          let status = "N/A"
          let statusColor = "text-gray-500"

          if (optimalRange) {
            if (measuredValue < optimalRange.min) {
              status = "Below"
              statusColor = "text-red-500"
            } else if (measuredValue > optimalRange.max) {
              status = "Above"
              statusColor = "text-orange-500"
            } else {
              status = "Optimal"
              statusColor = "text-green-500"
            }
          }

          return (
            <TableRow key={param.name}>
              <TableCell>{param.name}</TableCell>
              <TableCell>{measuredValue.toFixed(2)}</TableCell>
              {selectedCrop && (
                <TableCell>
                  {optimalRange ? `${optimalRange.min.toFixed(2)} - ${optimalRange.max.toFixed(2)}` : "N/A"}
                </TableCell>
              )}
              {selectedCrop && <TableCell className={statusColor}>{status}</TableCell>}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

