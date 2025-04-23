"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface AlertData {
  timestamp: string
  src_ip: string
  dest_ip: string
  dest_port: number
  proto: string
  category: string
  severity: number
}

interface AlertsOverTimeChartProps {
  data: AlertData[]
}

export default function AlertsOverTimeChart({ data }: AlertsOverTimeChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const hourCounts: Record<string, number> = {}

    data.forEach((alert) => {
      const date = new Date(alert.timestamp)
      const hourKey = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`

      if (!hourCounts[hourKey]) {
        hourCounts[hourKey] = 0
      }

      hourCounts[hourKey]++
    })

    // Sort by time
    const sortedHours = Object.keys(hourCounts).sort((a, b) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateA.getTime() - dateB.getTime()
    })

    const labels = sortedHours
    const counts = sortedHours.map((hour) => hourCounts[hour])

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Alerts",
              data: counts,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "#3b82f6",
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "#1f2937",
              titleColor: "#f9fafb",
              bodyColor: "#f9fafb",
              borderColor: "#374151",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(75, 85, 99, 0.2)",
              },
              ticks: {
                color: "#9ca3af",
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(75, 85, 99, 0.2)",
              },
              ticks: {
                color: "#9ca3af",
                precision: 0,
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  )
}
