"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface ChartProps {
  data: number[]
  labels: string[]
  title: string
  type: "bar" | "line" | "pie"
}

const ChartComponent: React.FC<ChartProps> = ({ data, labels, title, type }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }
        chartInstance.current = new Chart(ctx, {
          type,
          data: {
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, labels, title, type])

  return <canvas ref={chartRef} />
}

export default ChartComponent

