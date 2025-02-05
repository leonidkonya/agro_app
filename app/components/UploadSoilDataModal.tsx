"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadSoilDataModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: { [key: string]: number }) => void
  parameters: string[]
}

export default function UploadSoilDataModal({ isOpen, onClose, onUpload, parameters }: UploadSoilDataModalProps) {
  const [soilData, setSoilData] = useState<{ [key: string]: string }>({})

  const handleInputChange = (parameter: string, value: string) => {
    setSoilData((prevData) => ({
      ...prevData,
      [parameter]: value,
    }))
  }

  const handleUpload = () => {
    const processedData: { [key: string]: number } = {}
    for (const [key, value] of Object.entries(soilData)) {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        processedData[key] = numValue
      }
    }
    onUpload(processedData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Soil Sample Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {parameters.map((parameter) => (
            <div key={parameter} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={parameter} className="text-right">
                {parameter}
              </Label>
              <Input
                id={parameter}
                type="number"
                value={soilData[parameter] || ""}
                onChange={(e) => handleInputChange(parameter, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleUpload}>Upload Data</Button>
      </DialogContent>
    </Dialog>
  )
}

