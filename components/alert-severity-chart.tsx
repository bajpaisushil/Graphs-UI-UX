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

interface AlertSeverityChartProps {
  data: AlertData[]
}

export default function AlertSeverityChart({ data }: AlertSeverityChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const severityCounts = [0, 0, 0, 0]

    data.forEach((alert) => {
      const severityIndex = Math.min(Math.max(alert.severity - 1, 0), 3)
      severityCounts[severityIndex]++
    })

    const labels = ["Critical", "High", "Medium", "Low"]
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6"]

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Alert Count",
              data: severityCounts,
              backgroundColor: colors,
              borderWidth: 0,
              borderRadius: 6,
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
                display: false,
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
    <div className="h-60">
      <canvas ref={chartRef} />
    </div>
  )
}
