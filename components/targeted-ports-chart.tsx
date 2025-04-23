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

interface TargetedPortsChartProps {
  data: AlertData[]
}

export default function TargetedPortsChart({ data }: TargetedPortsChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const portCounts: Record<number, number> = {}

    data.forEach((alert) => {
      if (!portCounts[alert.dest_port]) {
        portCounts[alert.dest_port] = 0
      }

      portCounts[alert.dest_port]++
    })

    const topPorts = Object.entries(portCounts)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 10)

    const labels = topPorts.map(([port]) => {
      const portNum = Number(port)
      const serviceNames: Record<number, string> = {
        22: "SSH (22)",
        80: "HTTP (80)",
        443: "HTTPS (443)",
        3306: "MySQL (3306)",
        1433: "MSSQL (1433)",
        5432: "PostgreSQL (5432)",
        5060: "SIP (5060)",
        21: "FTP (21)",
        23: "Telnet (23)",
        25: "SMTP (25)",
        53: "DNS (53)",
        8080: "HTTP Alt (8080)",
        8443: "HTTPS Alt (8443)",
        3389: "RDP (3389)",
        5900: "VNC (5900)",
        5901: "VNC (5901)",
        5902: "VNC (5902)",
        5903: "VNC (5903)",
      }

      return serviceNames[portNum] || `Port ${portNum}`
    })

    const counts = topPorts.map(([, count]) => count)

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
        type: "polarArea",
        data: {
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: colors.map((color) => `${color}cc`),
              borderWidth: 1,
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
          scales: {
            r: {
              ticks: {
                display: false,
              },
              grid: {
                color: "rgba(75, 85, 99, 0.2)",
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
