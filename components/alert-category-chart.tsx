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

interface AlertCategoryChartProps {
  data: AlertData[]
}

export default function AlertCategoryChart({ data }: AlertCategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Count alerts by category
    const categoryCounts: Record<string, number> = {}

    data.forEach((alert) => {
      if (!categoryCounts[alert.category]) {
        categoryCounts[alert.category] = 0
      }

      categoryCounts[alert.category]++
    })

    // Sort by count
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

    const labels = sortedCategories.map(([category]) => category)
    const counts = sortedCategories.map(([, count]) => count)

    // Generate colors
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#6366f1",
      "#84cc16",
    ]

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")

    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: "#111827",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: "#d1d5db",
                padding: 10,
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                  size: 11,
                },
              },
            },
            tooltip: {
              backgroundColor: "#1f2937",
              titleColor: "#f9fafb",
              bodyColor: "#f9fafb",
              borderColor: "#374151",
              borderWidth: 1,
            },
          },
          cutout: "65%",
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
