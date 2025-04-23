"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, Shield } from "lucide-react"

interface AlertData {
  timestamp: string
  src_ip: string
  dest_ip: string
  dest_port: number
  proto: string
  category: string
  severity: number
}

interface AlertTableProps {
  data: AlertData[]
}

export default function AlertTable({ data }: AlertTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof AlertData>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  const filteredData = data.filter(
    (alert) =>
      alert.src_ip.includes(searchTerm) ||
      alert.dest_ip.includes(searchTerm) ||
      alert.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.proto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.dest_port.toString().includes(searchTerm),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === "timestamp") {
      const dateA = new Date(a[sortField]).getTime()
      const dateB = new Date(b[sortField]).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    }

    if (sortField === "severity" || sortField === "dest_port") {
      return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }

    const valueA = String(a[sortField]).toLowerCase()
    const valueB = String(b[sortField]).toLowerCase()
    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof AlertData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSeverityBadge = (severity: number) => {
    const colors = {
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-blue-500",
    }

    const labels = {
      1: "Critical",
      2: "High",
      3: "Medium",
      4: "Low",
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[severity as keyof typeof colors] || "bg-gray-500"
        }`}
      >
        {labels[severity as keyof typeof labels] || "Unknown"}
      </span>
    )
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
              <ChevronDown className="mr-2 h-4 w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem onClick={() => handleSort("timestamp")}>Time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("severity")}>Severity</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("src_ip")}>Source IP</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("dest_port")}>Destination Port</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("category")}>Category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Time</TableHead>
              <TableHead className="text-gray-300">Severity</TableHead>
              <TableHead className="text-gray-300">Source IP</TableHead>
              <TableHead className="text-gray-300">Destination</TableHead>
              <TableHead className="text-gray-300">Protocol</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((alert, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-mono text-sm">{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell className="font-mono">{alert.src_ip}</TableCell>
                  <TableCell className="font-mono">
                    {alert.dest_ip}:{alert.dest_port}
                  </TableCell>
                  <TableCell>{alert.proto}</TableCell>
                  <TableCell className="max-w-xs truncate">{alert.category}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Shield className="h-8 w-8 mb-2" />
                    <p>No alerts found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
            alerts
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 border-gray-700 text-white"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 border-gray-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
