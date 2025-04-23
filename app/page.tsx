"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Activity, Server, Globe, Clock } from "lucide-react"
import AlertsOverTimeChart from "@/components/alerts-over-time-chart"
import TopAttackersChart from "@/components/top-attackers-chart"
import AlertCategoryChart from "@/components/alert-category-chart"
import AlertSeverityChart from "@/components/alert-severity-chart"
import TargetedPortsChart from "@/components/targeted-ports-chart"
import AlertTable from "@/components/alert-table"
import { parseLogData } from "@/lib/data-utils"
import ClientTime from "@/components/client-time"

export default function Dashboard() {
  const [logData, setLogData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const parsedData = parseLogData()
        setLogData(parsedData)
      } catch (error) {
        console.error("Error fetching log data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalAlerts = logData.length
  const criticalAlerts = logData.filter((alert) => alert.severity === 1).length
  const uniqueAttackers = new Set(logData.map((alert) => alert.src_ip)).size
  const uniqueTargets = new Set(logData.map((alert) => alert.dest_port)).size

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold">Network Security Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">
              Last updated: <ClientTime />
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Activity className="mx-auto h-12 w-12 animate-pulse text-blue-500" />
              <p className="mt-4 text-lg">Loading security data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Alerts</p>
                      <p className="text-2xl text-white font-bold">{totalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Critical Alerts</p>
                      <p className="text-2xl text-white font-bold">{criticalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Unique Attackers</p>
                      <p className="text-2xl text-white font-bold">{uniqueAttackers}</p>
                    </div>
                    <Globe className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Targeted Ports</p>
                      <p className="text-2xl text-white font-bold">{uniqueTargets}</p>
                    </div>
                    <Server className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="bg-gray-900 text-white border-gray-800">
                <TabsTrigger value="overview" className="data-[state=active]:text-gray-500 text-gray-400">Overview</TabsTrigger>
                <TabsTrigger value="alerts" className="data-[state=active]:text-gray-500 text-gray-400">Alert Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 text-white">
                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Alerts Over Time</CardTitle>
                      <CardDescription className="text-gray-400">
                        Security events distribution over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertsOverTimeChart data={logData} />
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Top Attackers</CardTitle>
                      <CardDescription className="text-gray-400">Source IPs with most alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopAttackersChart data={logData} />
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Alert Categories</CardTitle>
                      <CardDescription className="text-gray-400">Distribution of alert types</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertCategoryChart data={logData} />
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Most Targeted Ports</CardTitle>
                      <CardDescription className="text-gray-400">
                        Destination ports with highest activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TargetedPortsChart data={logData} />
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 text-white bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Alert Severity Distribution</CardTitle>
                      <CardDescription className="text-gray-400">Breakdown of alerts by severity level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertSeverityChart data={logData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-4">
                <Card className="bg-gray-900 text-white border-gray-800">
                  <CardHeader>
                    <CardTitle>Alert Details</CardTitle>
                    <CardDescription className="text-gray-400">Detailed view of all security events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertTable data={logData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
