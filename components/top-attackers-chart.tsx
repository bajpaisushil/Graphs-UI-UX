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

interface TopAttackersChartProps {
  data: AlertData[]
}

export default function TopAttackersChart({ data }: TopAttackersChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Count alerts by source IP
    const ipCounts: Record<string, number> = {}

    data.forEach((alert) => {
      if (!ipCounts[alert.src_ip]) {
        ipCounts[alert.src_ip] = 0
      }

      ipCounts[alert.src_ip]++
    })

    // Sort by count and take top 10
    const topAttackers = Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    const labels = topAttackers.map(([ip]) => ip)
    const counts = topAttackers.map(([, count]) => count)

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
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Alert Count",
              data: counts,
              backgroundColor: colors,
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
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
                color: "rgba(75, 85, 99, 0.2)",
              },
              ticks: {
                color: "#9ca3af",
                precision: 0,
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#9ca3af",
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
