"use client"

import { useState, useEffect } from "react"

export default function ClientTime() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    // Only set the time on the client side after hydration
    setTime(new Date().toLocaleString())

    // Optional: Update the time every minute
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Return empty string during SSR to avoid hydration mismatch
  if (!time) return <span>Loading...</span>

  return <span>{time}</span>
}
